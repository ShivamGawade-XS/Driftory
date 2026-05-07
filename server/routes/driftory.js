const express = require("express")
const router = express.Router()
const rateLimit = require("express-rate-limit")
const { protect, isMockMode } = require("../middleware/auth")
const DriftoryRoute = require("../models/DriftoryRoute")
const DriftorySpot = require("../models/DriftorySpot")
const {
  extractSpotsFromDescription,
  validateWithPlacesAPI,
  findAlternatives,
  MOCK_ROUTE,
} = require("../services/driftory")
const fs = require("fs")
const path = require("path")

// rate limit for analyze endpoint: 10 requests per minute per IP
const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { message: "Too many analysis requests, please try again in a minute" },
  standardHeaders: true,
  legacyHeaders: false,
})

// POST /analyze — public, extracts route from reel description
router.post("/analyze", analyzeLimiter, async (req, res) => {
  try {
    const { caption, coastline } = req.body

    if (!caption || !caption.trim()) {
      return res.status(400).json({ message: "Caption is required" })
    }
    if (!coastline || !coastline.trim()) {
      return res.status(400).json({ message: "Coastline is required" })
    }

    // Mock mode — return hardcoded route
    if (isMockMode()) {
      return res.json({ success: true, route: MOCK_ROUTE })
    }

    // Extract spots from description via AI
    const extractedSpots = await extractSpotsFromDescription(req.body)

    // If extraction returned a full route object (mock fallback), return directly
    if (extractedSpots.title && extractedSpots.spots) {
      return res.json({ success: true, route: extractedSpots })
    }

    // Validate each spot and find alternatives in parallel
    const enrichedSpots = await Promise.all(
      extractedSpots.map(async (spot) => {
        const [validation, alternatives] = await Promise.all([
          validateWithPlacesAPI(spot.name, coastline),
          findAlternatives(spot, coastline),
        ])

        return {
          name: spot.name,
          placeId: validation.placeId,
          coordinates: validation.coordinates,
          verified: validation.verified,
          type: spot.type || "other",
          vibe: [spot.energy, spot.time, spot.crowd, spot.setting].filter(Boolean),
          bestTime: spot.bestTime || "Anytime",
          estimatedDuration: spot.estimatedDuration || 60,
          estimatedCost: spot.estimatedCost || { min: 0, max: 0 },
          alternatives,
          communityVerdicts: [],
        }
      })
    )

    // Calculate totals
    const totalDuration = enrichedSpots.reduce((sum, s) => sum + (s.estimatedDuration || 60), 0)
    const totalBudget = {
      min: enrichedSpots.reduce((sum, s) => sum + (s.estimatedCost?.min || 0), 0),
      max: enrichedSpots.reduce((sum, s) => sum + (s.estimatedCost?.max || 0), 0),
    }

    // Collect unique vibes
    const vibeSet = new Set()
    enrichedSpots.forEach((s) => (s.vibe || []).forEach((v) => vibeSet.add(v)))

    const route = {
      title: `${coastline} Experience Route`,
      coastline,
      vibeProfile: Array.from(vibeSet),
      totalDuration,
      totalBudget,
      spots: enrichedSpots,
    }

    return res.json({ success: true, route })
  } catch (err) {
    console.error("Driftory analyze error:", err)
    return res.status(500).json({ message: err.message || "Analysis failed" })
  }
})

// POST /save — auth required, saves route to user's dashboard
router.post("/save", protect, async (req, res) => {
  try {
    const routeData = req.body
    const driftoryRoute = new DriftoryRoute({
      ...routeData,
      userId: req.user._id,
    })
    await driftoryRoute.save()
    return res.json({
      success: true,
      id: driftoryRoute._id,
      shareToken: driftoryRoute.shareToken,
    })
  } catch (err) {
    console.error("Driftory save error:", err)
    return res.status(500).json({ message: "Failed to save route" })
  }
})

// POST /verify — auth required, adds community verdict to a spot
router.post("/verify", protect, async (req, res) => {
  try {
    const { routeId, spotIndex, verdict, note } = req.body

    const validVerdicts = ["open", "worth_it", "overcrowded", "closed"]
    if (!validVerdicts.includes(verdict)) {
      return res.status(400).json({ message: `Verdict must be one of: ${validVerdicts.join(", ")}` })
    }

    if (isMockMode()) {
      return res.json({ success: true, message: "Verdict recorded (mock)" })
    }

    const route = await DriftoryRoute.findById(routeId)
    if (!route) {
      return res.status(404).json({ message: "Route not found" })
    }

    if (spotIndex < 0 || spotIndex >= route.spots.length) {
      return res.status(400).json({ message: "Invalid spot index" })
    }

    route.spots[spotIndex].communityVerdicts.push({
      userId: req.user._id,
      verdict,
      note: note ? note.substring(0, 100) : undefined,
      createdAt: new Date(),
    })

    await route.save()
    return res.json({ success: true, message: "Verdict recorded" })
  } catch (err) {
    console.error("Driftory verify error:", err)
    return res.status(500).json({ message: "Failed to record verdict" })
  }
})

// GET /my — auth required, returns user's saved routes
router.get("/my", protect, async (req, res) => {
  try {
    if (isMockMode()) {
      return res.json({ success: true, routes: [] })
    }

    const routes = await DriftoryRoute.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean()

    return res.json({ success: true, routes })
  } catch (err) {
    console.error("Driftory my routes error:", err)
    return res.status(500).json({ message: "Failed to fetch routes" })
  }
})

// GET /shared/:token — public, returns a shared route
router.get("/shared/:token", async (req, res) => {
  try {
    if (isMockMode()) {
      return res.json({ success: true, route: { ...MOCK_ROUTE, shareToken: req.params.token } })
    }

    const route = await DriftoryRoute.findOne({ shareToken: req.params.token }).lean()
    if (!route) {
      return res.status(404).json({ message: "Shared route not found" })
    }

    return res.json({ success: true, route })
  } catch (err) {
    console.error("Driftory shared route error:", err)
    return res.status(500).json({ message: "Failed to fetch shared route" })
  }
})

// POST /seed — development only, seeds the coastal database
router.post("/seed", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ message: "Seed endpoint disabled in production" })
  }

  try {
    const dataPath = path.join(__dirname, "..", "data", "driftory", "goa-spots.json")
    const rawData = fs.readFileSync(dataPath, "utf-8")
    const spots = JSON.parse(rawData)

    let upserted = 0
    for (const spot of spots) {
      await DriftorySpot.findOneAndUpdate(
        { name: spot.name },
        { $set: spot },
        { upsert: true, new: true }
      )
      upserted++
    }

    return res.json({ success: true, message: `Seeded ${upserted} coastal spots` })
  } catch (err) {
    console.error("Driftory seed error:", err)
    return res.status(500).json({ message: "Failed to seed database" })
  }
})

module.exports = router

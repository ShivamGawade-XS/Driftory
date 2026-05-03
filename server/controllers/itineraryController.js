const Itinerary = require("../models/Itinerary")
const crypto = require("crypto")
const fs = require("fs")
const path = require("path")
const { isMockMode } = require("../middleware/auth")

const MOCK_DB_PATH = path.join("/tmp", "mockItineraries.json")

const readMockItineraries = () => {
  try {
    if (fs.existsSync(MOCK_DB_PATH)) {
      return JSON.parse(fs.readFileSync(MOCK_DB_PATH, "utf8"))
    }
  } catch (err) {
    console.error("Error reading mock itineraries:", err)
  }
  return []
}

const writeMockItineraries = (items) => {
  try {
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(items, null, 2))
  } catch (err) {
    console.error("Error writing mock itineraries:", err)
  }
}

// create new itinerary
// POST /api/v1/itinerary
const createItinerary = async (req, res) => {
  try {
    const { title, from, to, travelDate, transport, hotels } = req.body

    if (!title || !from || !to || !travelDate) {
      return res.status(400).json({ message: "Title, from, to, and travelDate are required" })
    }

    const shareToken = crypto.randomBytes(16).toString("hex")

    const newData = {
      userId: req.user._id,
      title,
      from,
      to,
      travelDate: new Date(travelDate).toISOString(),
      transport: transport || [],
      hotels: hotels || [],
      shareToken,
      createdAt: new Date().toISOString()
    }

    if (isMockMode()) {
      newData._id = "mock-itin-" + crypto.randomBytes(6).toString("hex")
      const items = readMockItineraries()
      items.push(newData)
      writeMockItineraries(items)
      return res.status(201).json(newData)
    }

    const itinerary = await Itinerary.create(newData)
    res.status(201).json(itinerary)
  } catch (error) {
    console.error("Create itinerary error:", error.message)
    res.status(500).json({ message: "Failed to create itinerary" })
  }
}

// get user's itineraries
// GET /api/v1/itinerary
const getMyItineraries = async (req, res) => {
  try {
    if (isMockMode()) {
      const items = readMockItineraries().filter(i => i.userId === req.user._id)
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      return res.json(items)
    }

    const itineraries = await Itinerary.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)

    res.json(itineraries)
  } catch (error) {
    console.error("Get itineraries error:", error.message)
    res.status(500).json({ message: "Failed to fetch itineraries" })
  }
}

// get single itinerary by id
// GET /api/v1/itinerary/:id
const getItinerary = async (req, res) => {
  try {
    if (isMockMode()) {
      const item = readMockItineraries().find(i => i._id === req.params.id && i.userId === req.user._id)
      if (!item) return res.status(404).json({ message: "Itinerary not found" })
      return res.json(item)
    }

    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" })
    }

    res.json(itinerary)
  } catch (error) {
    console.error("Get itinerary error:", error.message)
    res.status(500).json({ message: "Failed to fetch itinerary" })
  }
}

// delete itinerary
// DELETE /api/v1/itinerary/:id
const deleteItinerary = async (req, res) => {
  try {
    if (isMockMode()) {
      let items = readMockItineraries()
      const idx = items.findIndex(i => i._id === req.params.id && i.userId === req.user._id)
      if (idx === -1) return res.status(404).json({ message: "Itinerary not found" })
      items.splice(idx, 1)
      writeMockItineraries(items)
      return res.json({ message: "Itinerary deleted" })
    }

    const itinerary = await Itinerary.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" })
    }

    res.json({ message: "Itinerary deleted" })
  } catch (error) {
    console.error("Delete itinerary error:", error.message)
    res.status(500).json({ message: "Failed to delete itinerary" })
  }
}

// get shared itinerary by token (public route)
// GET /api/v1/itinerary/shared/:token
const getSharedItinerary = async (req, res) => {
  try {
    if (isMockMode()) {
      const item = readMockItineraries().find(i => i.shareToken === req.params.token)
      if (!item) return res.status(404).json({ message: "Shared itinerary not found" })
      const { userId, ...publicData } = item
      return res.json(publicData)
    }

    const itinerary = await Itinerary.findOne({
      shareToken: req.params.token,
    }).select("-userId")

    if (!itinerary) {
      return res.status(404).json({ message: "Shared itinerary not found" })
    }

    res.json(itinerary)
  } catch (error) {
    console.error("Get shared itinerary error:", error.message)
    res.status(500).json({ message: "Failed to fetch shared itinerary" })
  }
}

module.exports = {
  createItinerary,
  getMyItineraries,
  getItinerary,
  deleteItinerary,
  getSharedItinerary,
}

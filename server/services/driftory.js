const DriftorySpot = require("../models/DriftorySpot")

// Mock route data for USE_MOCK_API=true mode
const MOCK_ROUTE = {
  title: "Perfect North Goa Evening",
  coastline: "North Goa",
  vibeProfile: ["sunset", "chill", "party"],
  totalDuration: 360,
  totalBudget: { min: 1500, max: 3000 },
  spots: [
    {
      name: "Chapora Fort",
      placeId: "ChIJrY3oHKGovzsR2Q4Bu3W4VuQ",
      coordinates: { lat: 15.6075, lng: 73.7394 },
      verified: true,
      type: "viewpoint",
      vibe: ["sunset", "tourist", "chill"],
      bestTime: "5:30 PM – 7:00 PM",
      estimatedDuration: 60,
      estimatedCost: { min: 0, max: 0 },
      alternatives: [
        {
          name: "Vagator Hill North",
          reason: "Same panoramic sunset view, fraction of the crowd",
          crowdLevel: "local",
          coordinates: { lat: 15.5997, lng: 73.7367 },
        },
      ],
    },
    {
      name: "Thalassa Greek Restaurant",
      placeId: "ChIJN5LHbNKovzsRkdKzWanJPFo",
      coordinates: { lat: 15.5891, lng: 73.7401 },
      verified: true,
      type: "cafe",
      vibe: ["sunset", "moderate", "tourist"],
      bestTime: "7:30 PM – 9:30 PM",
      estimatedDuration: 90,
      estimatedCost: { min: 1200, max: 1800 },
      alternatives: [
        {
          name: "Antares Restaurant Vagator",
          reason: "Similar cliffside Mediterranean vibe, often less crowded",
          crowdLevel: "local",
          coordinates: { lat: 15.5934, lng: 73.7389 },
        },
      ],
    },
    {
      name: "Baga Beach Strip",
      placeId: "ChIJo8r1R_qnvzsRiXRMnul_S7A",
      coordinates: { lat: 15.5553, lng: 73.7517 },
      verified: true,
      type: "nightlife",
      vibe: ["night", "party", "crowded"],
      bestTime: "10:00 PM onwards",
      estimatedDuration: 120,
      estimatedCost: { min: 500, max: 1200 },
      alternatives: [
        {
          name: "Assagao Village Bar Scene",
          reason: "Indie nightlife, local crowd, significantly quieter than Baga",
          crowdLevel: "local",
          coordinates: { lat: 15.5717, lng: 73.7628 },
        },
      ],
    },
  ],
}

/**
 * Extract spots from a user's reel description using Claude AI
 * @param {Object} input - { caption, description, hashtags, coastline, vibes }
 * @returns {Object} extracted spots array
 */
async function extractSpotsFromDescription(input) {
  const { caption, description, hashtags, coastline, vibes } = input

  // Check mock mode
  if ((process.env.USE_MOCK_API || "").trim().toLowerCase() === "true") {
    return MOCK_ROUTE
  }

  let Anthropic
  try {
    Anthropic = require("@anthropic-ai/sdk")
  } catch (err) {
    console.warn("Anthropic SDK not installed, falling back to mock mode")
    return MOCK_ROUTE
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const systemPrompt = `You are a coastal travel expert specializing in Indian coastlines. Given a description of a travel reel or experience, extract a sequence of specific places/spots mentioned or implied.

For each spot, provide:
- name: the actual place name
- type: one of [beach, cafe, nightlife, viewpoint, hidden_gem, other]
- energy: one of [chill, moderate, party]
- time: one of [sunrise, daytime, sunset, night]
- crowd: one of [hidden, local, tourist, crowded]
- setting: one of [beach, shack, rooftop, jungle, village, nightlife]
- bestTime: suggested time window (e.g. "5:30 PM – 7:00 PM")
- estimatedDuration: minutes to spend there (number)
- estimatedCost: { min: number, max: number } in INR

NEVER generate coordinates. Only extract place names and classify them.
Return ONLY valid JSON array, no markdown fences, no preamble.
If you cannot identify any specific places, return an empty array [].`

  const userMessage = `Reel caption: ${caption || ""}
Additional description: ${description || ""}
Hashtags: ${(hashtags || []).join(", ")}
Coastline: ${coastline || "Goa"}
Vibes: ${(vibes || []).join(", ")}

Extract the spots sequence from this reel description.`

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    })

    const text = response.content[0].text.trim()
    let spots
    try {
      spots = JSON.parse(text)
    } catch (parseErr) {
      throw new Error(`Failed to parse AI response as JSON: ${parseErr.message}`)
    }

    if (!Array.isArray(spots)) {
      throw new Error("AI response is not an array of spots")
    }

    return spots
  } catch (err) {
    console.error("Claude API error:", err.message)
    throw new Error(`AI extraction failed: ${err.message}`)
  }
}

/**
 * Validate a spot name against Google Places API
 * Falls back to OSM Nominatim if DRIFTORY_FALLBACK_TO_OSM=true
 */
async function validateWithPlacesAPI(spotName, coastline) {
  // Mock mode
  if ((process.env.USE_MOCK_API || "").trim().toLowerCase() === "true") {
    return { placeId: null, coordinates: null, verified: false }
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    console.warn("No GOOGLE_PLACES_API_KEY configured, skipping validation")
    return { placeId: null, coordinates: null, verified: false }
  }

  try {
    const query = encodeURIComponent(`${spotName} ${coastline} India`)
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${apiKey}`
    const res = await fetch(url)
    const data = await res.json()

    if (data.results && data.results.length > 0) {
      const place = data.results[0]
      return {
        placeId: place.place_id,
        coordinates: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        },
        verified: true,
      }
    }
  } catch (err) {
    console.error(`Google Places API error for ${spotName}:`, err.message)
  }

  // Fallback to OSM Nominatim
  if ((process.env.DRIFTORY_FALLBACK_TO_OSM || "").trim().toLowerCase() === "true") {
    try {
      const query = encodeURIComponent(`${spotName} ${coastline} India`)
      const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`
      const res = await fetch(url, {
        headers: { "User-Agent": "TripSathi-Driftory/1.0" },
      })
      const data = await res.json()

      if (data && data.length > 0) {
        return {
          placeId: null,
          coordinates: {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          },
          verified: false,
        }
      }
    } catch (err) {
      console.error(`OSM Nominatim error for ${spotName}:`, err.message)
    }
  }

  return { placeId: null, coordinates: null, verified: false }
}

/**
 * Find lesser-known alternatives for a spot from the curated database
 */
async function findAlternatives(spot, coastline) {
  try {
    // First try: same coastline, overlapping vibe, hidden/local crowd
    let alternatives = await DriftorySpot.find({
      coastline,
      name: { $ne: spot.name },
      vibe: { $in: spot.vibe || [] },
      crowdLevel: { $in: ["hidden", "local"] },
    })
      .limit(2)
      .lean()

    // If fewer than 2, relax the crowd filter
    if (alternatives.length < 2) {
      alternatives = await DriftorySpot.find({
        coastline,
        name: { $ne: spot.name },
        vibe: { $in: spot.vibe || [] },
      })
        .limit(2)
        .lean()
    }

    return alternatives.map((alt) => ({
      name: alt.name,
      placeId: alt.placeId || null,
      coordinates: alt.coordinates || null,
      reason: `Similar ${(alt.vibe || []).join("/")} vibe with ${alt.crowdLevel || "fewer"} crowds`,
      crowdLevel: alt.crowdLevel || "local",
    }))
  } catch (err) {
    console.error("findAlternatives error:", err.message)
    return []
  }
}

module.exports = {
  extractSpotsFromDescription,
  validateWithPlacesAPI,
  findAlternatives,
  MOCK_ROUTE,
}

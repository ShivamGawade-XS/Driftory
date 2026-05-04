const { getMockTransport, getMockHotels } = require("../services/mockService")
const { aggregateResults } = require("../services/aggregationEngine")
const { sortTransport, sortHotels, calculateSavings, addRanks } = require("../services/rankingService")
const { getCache, setCache } = require("../utils/cache")
const SearchHistory = require("../models/SearchHistory")

// search transport options (trains + buses)
// GET /api/v1/search/transport?from=Delhi&to=Mumbai&date=2026-04-10
const searchTransport = async (req, res) => {
  try {
    const { from, to, date, sort } = req.query

    if (!from || !to) {
      return res
        .status(400)
        .json({ message: "From and to cities are required" })
    }

    let results = getMockTransport(from, to)

    // apply sorting if specified
    if (sort) {
      const { sortTransport: sortFn } = require("../services/rankingService")
      results = sortFn(results, sort)
    }

    // log search (non-blocking)
    SearchHistory.create({
      userId: req.user?._id || null,
      from,
      to,
      date: date ? new Date(date) : new Date(),
      resultsCount: results.length,
    }).catch((err) => console.error("Failed to log search:", err.message))

    res.json({
      results,
      count: results.length,
      query: { from, to, date },
    })
  } catch (error) {
    console.error("Transport search error:", error.message)
    res.status(500).json({ message: "Search failed" })
  }
}

// search hotels
// GET /api/v1/search/hotels?city=Mumbai&date=2026-04-10
const searchHotels = async (req, res) => {
  try {
    const { city, date, sort } = req.query

    if (!city) {
      return res.status(400).json({ message: "City is required" })
    }

    let results = getMockHotels(city)

    if (sort) {
      const { sortHotels: sortFn } = require("../services/rankingService")
      results = sortFn(results, sort)
    }

    res.json({
      results,
      count: results.length,
      query: { city, date, sort },
    })
  } catch (error) {
    console.error("Hotel search error:", error.message)
    res.status(500).json({ message: "Hotel search failed" })
  }
}

// unified search - the main endpoint
// GET /api/v1/search?from=Delhi&to=Mumbai&date=2026-04-10&sort=price
const unifiedSearch = async (req, res) => {
  try {
    const { from, to, date, sort } = req.query

    if (!from || !to) {
      return res
        .status(400)
        .json({ message: "From and to cities are required" })
    }

    // check cache first
    const cacheKey = `search:${from.toLowerCase()}:${to.toLowerCase()}:${date || "any"}`
    const cached = await getCache(cacheKey)

    if (cached) {
      console.log(`Cache hit for ${cacheKey}`)
      return res.json({ ...cached, cached: true })
    }

    // aggregate results from all sources
    const aggregated = await aggregateResults(from, to, date)

    // sort results
    const sortedTransport = addRanks(sortTransport(aggregated.transport, sort || "price"))
    const sortedHotels = addRanks(sortHotels(aggregated.hotels, sort || "price"))

    // calculate potential savings
    const savings = calculateSavings(aggregated.transport, aggregated.hotels)

    const response = {
      transport: sortedTransport,
      hotels: sortedHotels,
      savings,
      meta: aggregated.meta,
      cached: false,
    }

    // cache the results (15 min TTL)
    await setCache(cacheKey, response)

    // log search (non-blocking)
    SearchHistory.create({
      userId: req.user?._id || null,
      from,
      to,
      date: date ? new Date(date) : new Date(),
      resultsCount: sortedTransport.length + sortedHotels.length,
    }).catch((err) => console.error("Failed to log search:", err.message))

    res.json(response)
  } catch (error) {
    console.error("Unified search error:", error.message)
    res.status(500).json({ message: "Search failed" })
  }
}

module.exports = { searchTransport, searchHotels, unifiedSearch }
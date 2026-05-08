const express = require("express")
const router = express.Router()
const {
  searchTransport,
  searchHotels,
  unifiedSearch,
} = require("../controllers/searchController")

// GET /api/v1/search - unified search (main endpoint)
router.get("/", unifiedSearch)

// GET /api/v1/search/transport
router.get("/transport", searchTransport)

// GET /api/v1/search/hotels
router.get("/hotels", searchHotels)

module.exports = router
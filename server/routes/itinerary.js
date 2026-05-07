const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/auth")
const {
  createItinerary,
  getMyItineraries,
  getItinerary,
  deleteItinerary,
  getSharedItinerary,
} = require("../controllers/itineraryController")

// public route - get shared itinerary (must be before :id route)
router.get("/shared/:token", getSharedItinerary)

// protected routes
router.post("/", protect, createItinerary)
router.get("/", protect, getMyItineraries)
router.get("/:id", protect, getItinerary)
router.delete("/:id", protect, deleteItinerary)

module.exports = router

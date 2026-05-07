const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/auth")
const { createBooking, getMyBookings, getBookingByRef } = require("../controllers/bookingController")

router.post("/", protect, createBooking)
router.get("/", protect, getMyBookings)
router.get("/:ref", protect, getBookingByRef)

module.exports = router

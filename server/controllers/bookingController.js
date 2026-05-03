const Booking = require("../models/Booking")
const crypto = require("crypto")
const fs = require("fs")
const path = require("path")
const { isMockMode } = require("../middleware/auth")

const MOCK_DB_PATH = path.join("/tmp", "mockBookings.json")

const readMockBookings = () => {
  try {
    if (fs.existsSync(MOCK_DB_PATH)) {
      return JSON.parse(fs.readFileSync(MOCK_DB_PATH, "utf8"))
    }
  } catch (err) {
    console.error("Error reading mock DB:", err)
  }
  return []
}

const writeMockBookings = (bookings) => {
  try {
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(bookings, null, 2))
  } catch (err) {
    console.error("Error writing mock DB:", err)
  }
}

const createBooking = async (req, res) => {
  try {
    const { type, packageId, from, to, travelDate, returnDate, passengers, totalAmount, transport, hotel, contactEmail, contactPhone, specialRequests } = req.body

    if (!type || !travelDate || !totalAmount) {
      return res.status(400).json({ message: "Type, travel date, and total amount are required" })
    }

    const bookingRef = "TS" + Date.now().toString(36).toUpperCase() + crypto.randomBytes(3).toString("hex").toUpperCase()

    const newBookingData = {
      userId: req.user._id,
      type,
      packageId,
      from,
      to,
      travelDate,
      returnDate,
      passengers: passengers || [],
      totalAmount,
      currency: "INR",
      transport,
      hotel,
      contactEmail,
      contactPhone,
      specialRequests,
      status: "confirmed",
      bookingRef,
      createdAt: new Date().toISOString()
    }

    if (isMockMode()) {
      newBookingData._id = "mock-booking-" + bookingRef
      const bookings = readMockBookings()
      bookings.push(newBookingData)
      writeMockBookings(bookings)
      return res.status(201).json(newBookingData)
    }

    const booking = await Booking.create(newBookingData)
    res.status(201).json(booking)
  } catch (error) {
    console.error("Create booking error:", error.message)
    res.status(500).json({ message: "Failed to create booking" })
  }
}

const getMyBookings = async (req, res) => {
  try {
    if (isMockMode()) {
      const bookings = readMockBookings().filter(b => b.userId === req.user._id)
      bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      return res.json(bookings)
    }

    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" })
  }
}

const getBookingByRef = async (req, res) => {
  try {
    if (isMockMode()) {
      const booking = readMockBookings().find(b => b.bookingRef === req.params.ref && b.userId === req.user._id)
      if (!booking) return res.status(404).json({ message: "Booking not found" })
      return res.json(booking)
    }

    const booking = await Booking.findOne({ bookingRef: req.params.ref, userId: req.user._id })
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }
    res.json(booking)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch booking" })
  }
}

module.exports = { createBooking, getMyBookings, getBookingByRef }

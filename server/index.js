const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./utils/db")
const { connectRedis } = require("./utils/cache")
const { setupSecurity } = require("./middleware/security")

dotenv.config()

const app = express()
app.set("trust proxy", 1) // Required for express-rate-limit on Vercel
const PORT = process.env.PORT || 5000

// security middleware
setupSecurity(app)

// parse incoming json
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// connect to database and cache
connectDB()
connectRedis()

// routes
app.use("/api/v1/auth", require("./routes/auth"))
app.use("/api/v1/search", require("./routes/search"))
app.use("/api/v1/itinerary", require("./routes/itinerary"))
app.use("/api/v1/packages", require("./routes/packages"))
app.use("/api/v1/bookings", require("./routes/bookings"))
app.use("/api/v1/faqs", require("./routes/faqs"))
app.use("/api/v1/alerts", require("./routes/alerts"))
app.use("/api/v1/split", require("./routes/split"))
app.use("/api/v1/whatsapp", require("./routes/whatsapp"))
app.use("/api/v1/driftory", require("./routes/driftory"))

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack)
  res.status(500).json({ message: "Internal server error" })
})

app.listen(PORT, () => {
  console.log(`TripSathi server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
})

module.exports = app
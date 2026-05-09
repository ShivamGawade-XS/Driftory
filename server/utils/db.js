const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // mongoose 8 handles these by default now
    })

    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.warn(`MongoDB setup skipped: Missing URI or connection failed. Running in mock mode.`)
    // process.exit(1) // Removed so the server can run without DB
  }
}

// handle connection events
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected")
})

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB error: ${err}`)
})

module.exports = connectDB
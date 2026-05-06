const mongoose = require("mongoose")

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["male", "female", "other"] },
}, { _id: false })

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["package", "transport", "hotel", "bundle"], required: true },
  packageId: String,
  status: { type: String, enum: ["pending", "confirmed", "cancelled", "completed"], default: "pending" },
  from: String,
  to: String,
  travelDate: { type: Date, required: true },
  returnDate: Date,
  passengers: [passengerSchema],
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  transport: {
    type: { type: String, enum: ["train", "bus", "flight"] },
    name: String,
    provider: String,
    class: String,
    seatNumbers: [String],
  },
  hotel: {
    name: String,
    rooms: { type: Number, default: 1 },
    checkIn: Date,
    checkOut: Date,
  },
  contactEmail: String,
  contactPhone: String,
  specialRequests: String,
  bookingRef: { type: String, unique: true },
}, { timestamps: true })

bookingSchema.index({ userId: 1, createdAt: -1 })
bookingSchema.index({ bookingRef: 1 })

module.exports = mongoose.model("Booking", bookingSchema)

const mongoose = require("mongoose")

const transportItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["train", "bus"],
      required: true,
    },
    provider: { type: String, required: true },
    name: { type: String, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    from: String,
    to: String,
  },
  { _id: false }
)

const hotelItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    provider: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    rating: { type: Number, min: 0, max: 5 },
    location: String,
    imageUrl: String,
  },
  { _id: false }
)

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    from: { type: String, required: true },
    to: { type: String, required: true },
    travelDate: { type: Date, required: true },
    transport: [transportItemSchema],
    hotels: [hotelItemSchema],
    shareToken: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
)

// index for faster queries
itinerarySchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model("Itinerary", itinerarySchema)
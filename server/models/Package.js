const mongoose = require("mongoose")

const daySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  activities: [String],
}, { _id: false })

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  destination: { type: String, required: true },
  category: { type: String, enum: ["adventure", "pilgrimage", "beach", "heritage", "honeymoon", "family", "group"], required: true },
  duration: { days: Number, nights: Number },
  price: { original: Number, discounted: Number, currency: { type: String, default: "INR" } },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, default: 0 },
  maxGroupSize: { type: Number, default: 20 },
  difficulty: { type: String, enum: ["easy", "moderate", "challenging"], default: "easy" },
  images: [String],
  coverImage: String,
  highlights: [String],
  itinerary: [daySchema],
  inclusions: [String],
  exclusions: [String],
  transport: { type: String, enum: ["train", "bus", "flight", "mixed"] },
  startCity: String,
  featured: { type: Boolean, default: false },
  seasonal: { type: Boolean, default: false },
  groupDeal: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
}, { timestamps: true })

packageSchema.index({ destination: 1 })
packageSchema.index({ category: 1 })
packageSchema.index({ featured: 1 })

module.exports = mongoose.model("Package", packageSchema)

const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  packageId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, trim: true, maxlength: 200 },
  comment: { type: String, required: true, maxlength: 1000 },
  travelDate: Date,
  helpful: { type: Number, default: 0 },
  images: [String],
}, { timestamps: true })

reviewSchema.index({ packageId: 1, createdAt: -1 })
reviewSchema.index({ userId: 1 })

module.exports = mongoose.model("Review", reviewSchema)

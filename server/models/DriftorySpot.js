const mongoose = require("mongoose")

const communityReportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verdict: {
      type: String,
      enum: ["open", "worth_it", "overcrowded", "closed"],
      required: true,
    },
    note: { type: String, maxlength: 100 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const driftorySpotSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    placeId: { type: String, default: null },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    coastline: {
      type: String,
      required: true,
      enum: ["North Goa", "South Goa", "Konkan", "Alibaug", "Varkala", "Other"],
    },
    type: {
      type: String,
      required: true,
      enum: ["beach", "cafe", "nightlife", "viewpoint", "hidden_gem", "other"],
    },
    vibe: [{ type: String }],
    crowdLevel: {
      type: String,
      enum: ["hidden", "local", "tourist", "crowded"],
      default: "tourist",
    },
    bestTime: { type: String },
    estimatedCost: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
    },
    alternatives: [{ type: String }],
    verified: { type: Boolean, default: false },
    lastVerified: { type: Date },
    communityReports: [communityReportSchema],
  },
  { timestamps: true }
)

driftorySpotSchema.index({ coastline: 1, type: 1 })
driftorySpotSchema.index({ vibe: 1 })
driftorySpotSchema.index({ crowdLevel: 1 })

module.exports = mongoose.model("DriftorySpot", driftorySpotSchema)

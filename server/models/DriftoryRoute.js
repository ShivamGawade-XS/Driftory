const mongoose = require("mongoose")
const crypto = require("crypto")

const communityVerdictSchema = new mongoose.Schema(
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

const alternativeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    placeId: { type: String, default: null },
    coordinates: {
      lat: Number,
      lng: Number,
    },
    reason: { type: String },
    crowdLevel: {
      type: String,
      enum: ["hidden", "local", "tourist", "crowded"],
    },
  },
  { _id: false }
)

const routeSpotSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    placeId: { type: String, default: null },
    coordinates: {
      lat: Number,
      lng: Number,
    },
    verified: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ["beach", "cafe", "nightlife", "viewpoint", "hidden_gem", "other"],
    },
    vibe: [{ type: String }],
    bestTime: { type: String },
    estimatedDuration: { type: Number, default: 60 },
    estimatedCost: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
    },
    communityVerdicts: [communityVerdictSchema],
    alternatives: [alternativeSchema],
  },
  { _id: false }
)

const driftoryRouteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  title: { type: String, required: true, trim: true },
  coastline: { type: String, required: true },
  vibeProfile: [{ type: String }],
  totalDuration: { type: Number, default: 0 },
  totalBudget: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
  },
  spots: [routeSpotSchema],
  creatorHandle: { type: String, default: null },
  creatorVerified: { type: Boolean, default: false },
  shareToken: { type: String, unique: true },
  savedToItinerary: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

// auto-generate share token before save
driftoryRouteSchema.pre("save", function (next) {
  if (!this.shareToken) {
    this.shareToken = crypto.randomBytes(8).toString("hex")
  }
  next()
})

driftoryRouteSchema.index({ userId: 1, createdAt: -1 })
driftoryRouteSchema.index({ shareToken: 1 })

module.exports = mongoose.model("DriftoryRoute", driftoryRouteSchema)

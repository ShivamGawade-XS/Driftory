const mongoose = require("mongoose")

const searchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    resultsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// auto-delete old search history (keep last 30 days)
searchHistorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 })

module.exports = mongoose.model("SearchHistory", searchHistorySchema)
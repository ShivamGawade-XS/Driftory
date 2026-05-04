const reviews = require("../data/mock/reviews.json")

const getReviewsByPackage = async (req, res) => {
  try {
    const { packageId } = req.params
    const { sort } = req.query
    let results = reviews.filter(r => r.packageId === packageId)

    switch (sort) {
      case "recent": results.sort((a, b) => new Date(b.travelDate) - new Date(a.travelDate)); break
      case "helpful": results.sort((a, b) => b.helpful - a.helpful); break
      case "rating_high": results.sort((a, b) => b.rating - a.rating); break
      case "rating_low": results.sort((a, b) => a.rating - b.rating); break
      default: results.sort((a, b) => b.helpful - a.helpful)
    }

    const avgRating = results.length > 0
      ? (results.reduce((sum, r) => sum + r.rating, 0) / results.length).toFixed(1)
      : 0
    const distribution = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: results.filter(r => r.rating === star).length,
      percentage: results.length > 0 ? Math.round((results.filter(r => r.rating === star).length / results.length) * 100) : 0,
    }))

    res.json({ reviews: results, count: results.length, avgRating: parseFloat(avgRating), distribution })
  } catch (error) {
    console.error("Get reviews error:", error.message)
    res.status(500).json({ message: "Failed to fetch reviews" })
  }
}

module.exports = { getReviewsByPackage }

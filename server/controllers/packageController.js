const packages = require("../data/mock/packages.json")
const reviews = require("../data/mock/reviews.json")

const getAllPackages = async (req, res) => {
  try {
    const { category, featured, seasonal, groupDeal, sort, search } = req.query
    let results = [...packages]

    if (category) results = results.filter(p => p.category === category)
    if (featured === "true") results = results.filter(p => p.featured)
    if (seasonal === "true") results = results.filter(p => p.seasonal)
    if (groupDeal === "true") results = results.filter(p => p.groupDeal)
    if (search) {
      const q = search.toLowerCase()
      results = results.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.destination.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    }

    switch (sort) {
      case "price": results.sort((a, b) => a.price.discounted - b.price.discounted); break
      case "price_desc": results.sort((a, b) => b.price.discounted - a.price.discounted); break
      case "rating": results.sort((a, b) => b.rating - a.rating); break
      case "duration": results.sort((a, b) => a.duration.days - b.duration.days); break
      default: results.sort((a, b) => b.featured - a.featured)
    }

    res.json({ packages: results, count: results.length })
  } catch (error) {
    console.error("Get packages error:", error.message)
    res.status(500).json({ message: "Failed to fetch packages" })
  }
}

const getPackageBySlug = async (req, res) => {
  try {
    const pkg = packages.find(p => p.slug === req.params.slug || p.id === req.params.slug)
    if (!pkg) return res.status(404).json({ message: "Package not found" })

    const pkgReviews = reviews.filter(r => r.packageId === pkg.id)
    res.json({ ...pkg, reviews: pkgReviews })
  } catch (error) {
    console.error("Get package error:", error.message)
    res.status(500).json({ message: "Failed to fetch package" })
  }
}

const getFeaturedPackages = async (req, res) => {
  try {
    const featured = packages.filter(p => p.featured).slice(0, 4)
    res.json({ packages: featured, count: featured.length })
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch featured packages" })
  }
}

const getTrendingPackages = async (req, res) => {
  try {
    const seasonal = packages.filter(p => p.seasonal)
    const groupDeals = packages.filter(p => p.groupDeal)
    const topRated = [...packages].sort((a, b) => b.rating - a.rating).slice(0, 3)
    res.json({ seasonal, groupDeals, topRated })
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trending packages" })
  }
}

const getCategories = async (req, res) => {
  const categories = [...new Set(packages.map(p => p.category))]
  const counts = categories.map(cat => ({
    name: cat,
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: packages.filter(p => p.category === cat).length,
  }))
  res.json({ categories: counts })
}

module.exports = { getAllPackages, getPackageBySlug, getFeaturedPackages, getTrendingPackages, getCategories }

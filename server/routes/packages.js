const express = require("express")
const router = express.Router()
const { getAllPackages, getPackageBySlug, getFeaturedPackages, getTrendingPackages, getCategories } = require("../controllers/packageController")
const { getReviewsByPackage } = require("../controllers/reviewController")

router.get("/", getAllPackages)
router.get("/featured", getFeaturedPackages)
router.get("/trending", getTrendingPackages)
router.get("/categories", getCategories)
router.get("/:slug", getPackageBySlug)
router.get("/:packageId/reviews", getReviewsByPackage)

module.exports = router

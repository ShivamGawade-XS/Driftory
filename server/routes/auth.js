const express = require("express")
const router = express.Router()
const { registerUser, loginUser, getMe } = require("../controllers/authController")
const { protect } = require("../middleware/auth")

// POST /api/v1/auth/register
router.post("/register", registerUser)

// POST /api/v1/auth/login
router.post("/login", loginUser)

// GET /api/v1/auth/me (protected)
router.get("/me", protect, getMe)

module.exports = router
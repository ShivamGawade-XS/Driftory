const User = require("../models/User")
const { generateToken, isMockMode } = require("../middleware/auth")

// register new user
// POST /api/v1/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, language } = req.body

    if (isMockMode()) {
      const token = generateToken("mock-user-123")
      return res.status(201).json({ _id: "mock-user-123", name, email, language: language || "en", token })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" })
    }

    const user = await User.create({
      name,
      email,
      passwordHash: password,
      language: language || "en",
    })

    const token = generateToken(user._id)

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      language: user.language,
      token,
    })
  } catch (error) {
    console.error("Register error:", error.message)
    res.status(500).json({ message: "Server error during registration" })
  }
}

// login user
// POST /api/v1/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (isMockMode()) {
      const token = generateToken("mock-user-123")
      return res.json({ _id: "mock-user-123", name: "Demo User", email, language: "en", token })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const token = generateToken(user._id)

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      language: user.language,
      token,
    })
  } catch (error) {
    console.error("Login error:", error.message)
    res.status(500).json({ message: "Server error during login" })
  }
}

// get current user profile
// GET /api/v1/auth/me
const getMe = async (req, res) => {
  try {
    if (isMockMode()) {
      return res.json({
        _id: "mock-user-123", name: "Demo User", email: "demo@tripsathi.com",
        language: "en", createdAt: new Date()
      })
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      language: user.language,
      createdAt: user.createdAt,
    })
  } catch (error) {
    console.error("GetMe error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { registerUser, loginUser, getMe }
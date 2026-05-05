const jwt = require("jsonwebtoken")
const User = require("../models/User")
const mongoose = require("mongoose")

const JWT_FALLBACK = "tripsathi_hackathon_jwt_secret_2026"
const getSecret = () => (process.env.JWT_SECRET || JWT_FALLBACK).trim()

const isMockMode = () => {
  const envFlag = (process.env.USE_MOCK_API || "").trim().toLowerCase()
  const dbDown = mongoose.connection.readyState !== 1
  return envFlag === "true" || dbDown
}

const protect = async (req, res, next) => {
  let token = null

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" })
  }

  try {
    const decoded = jwt.verify(token, getSecret())

    if (isMockMode()) {
      req.user = { _id: "mock-user-123", name: "Demo User", email: "demo@tripsathi.com", language: "en" }
      return next()
    }

    req.user = await User.findById(decoded.id).select("-passwordHash")

    if (!req.user) {
      return res.status(401).json({ message: "User not found" })
    }

    next()
  } catch (error) {
    console.error("Auth middleware error:", error.message)
    return res.status(401).json({ message: "Not authorized, token invalid" })
  }
}

// generate jwt token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, getSecret(), {
    expiresIn: "7d",
  })
}

module.exports = { protect, generateToken, isMockMode }
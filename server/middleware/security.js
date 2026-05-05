const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")

// cors configuration
const corsOptions = {
  origin: ["http://localhost:3000", "https://tripsathi-web.vercel.app", process.env.FRONTEND_URL],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

// rate limiter - 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 100 : 500,
  message: {
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    message: "Too many login attempts, please try again later",
  },
})

const setupSecurity = (app) => {
  app.use(helmet())
  app.use(cors(corsOptions))
  app.use("/api/", limiter)
  app.use("/api/v1/auth", authLimiter)
}

module.exports = { setupSecurity }
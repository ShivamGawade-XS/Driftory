/**
 * Redis caching layer
 * Falls back to in-memory cache if Redis isn't available
 */

// simple in-memory cache as fallback
const memoryCache = new Map()

let redisClient = null

const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    console.log("No REDIS_URL found, using in-memory cache")
    return null
  }

  try {
    const { createClient } = require("redis")
    redisClient = createClient({ url: process.env.REDIS_URL })
    redisClient.on("error", (err) => {
      console.error("Redis error:", err.message)
      redisClient = null
    })
    await redisClient.connect()
    console.log("Redis connected")
    return redisClient
  } catch (error) {
    console.log("Redis connection failed, using in-memory cache:", error.message)
    return null
  }
}

// get cached data
const getCache = async (key) => {
  try {
    if (redisClient) {
      const data = await redisClient.get(key)
      return data ? JSON.parse(data) : null
    }

    // fallback to memory cache
    const cached = memoryCache.get(key)
    if (cached && cached.expiry > Date.now()) {
      return cached.data
    }
    memoryCache.delete(key)
    return null
  } catch (error) {
    console.error("Cache get error:", error.message)
    return null
  }
}

// set cached data with TTL (default 15 minutes)
const setCache = async (key, data, ttl = 900) => {
  try {
    if (redisClient) {
      await redisClient.setEx(key, ttl, JSON.stringify(data))
      return
    }

    // fallback to memory cache
    memoryCache.set(key, {
      data,
      expiry: Date.now() + ttl * 1000,
    })
  } catch (error) {
    console.error("Cache set error:", error.message)
  }
}

// clear specific cache key
const clearCache = async (key) => {
  try {
    if (redisClient) {
      await redisClient.del(key)
    }
    memoryCache.delete(key)
  } catch (error) {
    console.error("Cache clear error:", error.message)
  }
}

module.exports = { connectRedis, getCache, setCache, clearCache }
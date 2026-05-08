/**
 * Sorting and ranking service for search results
 * Supports sorting by price, duration, and rating
 */

// parse duration string like "15h 40m" to total minutes
const parseDuration = (duration) => {
  const match = duration.match(/(\d+)h\s*(\d+)?m?/)
  if (!match) return Infinity

  const hours = parseInt(match[1]) || 0
  const minutes = parseInt(match[2]) || 0
  return hours * 60 + minutes
}

// sort transport results
const sortTransport = (results, sortBy = "price") => {
  const sorted = [...results]

  switch (sortBy) {
    case "price":
      sorted.sort((a, b) => a.price - b.price)
      break
    case "duration":
      sorted.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration))
      break
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating)
      break
    default:
      // default: sort by price
      sorted.sort((a, b) => a.price - b.price)
  }

  return sorted
}

// sort hotel results
const sortHotels = (results, sortBy = "price") => {
  const sorted = [...results]

  switch (sortBy) {
    case "price":
      sorted.sort((a, b) => a.pricePerNight - b.pricePerNight)
      break
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating)
      break
    default:
      sorted.sort((a, b) => a.pricePerNight - b.pricePerNight)
  }

  return sorted
}

// calculate savings vs booking cheapest train + cheapest hotel separately
const calculateSavings = (transport, hotels) => {
  if (transport.length === 0) return 0

  const cheapestTransport = Math.min(...transport.map((t) => t.price))
  const cheapestHotel =
    hotels.length > 0 ? Math.min(...hotels.map((h) => h.pricePerNight)) : 0

  // simulated savings (in production this would compare with individual platform prices)
  const bundleDiscount = Math.round((cheapestTransport + cheapestHotel) * 0.08)
  return bundleDiscount
}

// add rank position to sorted results
const addRanks = (results) => {
  return results.map((item, index) => ({
    ...item,
    rank: index + 1,
  }))
}

module.exports = {
  sortTransport,
  sortHotels,
  calculateSavings,
  addRanks,
  parseDuration,
}
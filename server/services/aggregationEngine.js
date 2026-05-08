const { getMockSearchResults } = require("./mockService")

/**
 * Main aggregation engine
 * Fetches results from all sources and normalizes them
 */
const aggregateResults = async (from, to, date) => {
  // in production, this would call real APIs in parallel:
  // const [irctcResults, redbusResults, hotelResults] = await Promise.all([
  //   fetchIRCTC(from, to, date),
  //   fetchRedBus(from, to, date),
  //   fetchHotels(to, date),
  // ])

  // for now, use mock data
  const mockResults = getMockSearchResults(from, to)

  // normalize all transport results to a common schema
  const normalizedTransport = mockResults.transport.map((item) => ({
    id: item.id,
    type: item.type,
    name: item.name,
    provider: item.provider,
    from: item.from,
    to: item.to,
    departureTime: item.departureTime,
    arrivalTime: item.arrivalTime,
    duration: item.duration,
    price: item.price,
    rating: item.rating || 0,
    availableSeats: item.availableSeats || null,
    class: item.class || item.busType || null,
    source: "mock",
  }))

  // normalize hotel results
  const normalizedHotels = mockResults.hotels.map((hotel) => ({
    id: hotel.id,
    name: hotel.name,
    provider: hotel.provider,
    city: hotel.city,
    pricePerNight: hotel.pricePerNight,
    rating: hotel.rating,
    location: hotel.location,
    amenities: hotel.amenities || [],
    imageUrl: hotel.imageUrl,
    type: hotel.type,
    source: "mock",
  }))

  return {
    transport: normalizedTransport,
    hotels: normalizedHotels,
    meta: {
      from,
      to,
      date,
      transportCount: normalizedTransport.length,
      hotelCount: normalizedHotels.length,
      fetchedAt: new Date().toISOString(),
    },
  }
}

module.exports = { aggregateResults }
// Procedural Data Generation Engine for infinite route support

// 1. Seeded Random Number Generator
function cyrb128(str) {
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
      k = str.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
      h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
      h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
      h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
}

function mulberry32(a) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

// Asset banks for generation
const HORIZON_TRAINS = ["Vande Bharat Express", "Shatabdi Express", "Rajdhani Express", "Duronto Express", "Garib Rath Express", "Jan Shatabdi Express", "Sampark Kranti Express", "Superfast Express"];
const HORIZON_BUSES = ["Volvo Multi-Axle", "Scania Seater", "Ashok Leyland Sleeper", "BharatBenz AC Sleeper", "Redbus Premium", "IntrCity SmartBus", "Zingbus Luxe", "SRS Travels"];
const HOTEL_CHAINS = ["Taj Resorts", "Radisson Blu", "ITC Grand", "The Leela", "Novotel", "Lemon Tree Hotels", "Treebo Trend", "FabHotel Premium", "Oyo Townhouse", "Marriott", "Hyatt Regency", "Holiday Inn"];
const AMENITIES = ["Free WiFi", "Pool", "Gym", "Spa", "Breakfast Included", "Bar", "Parking", "Restaurant", "Room Service", "Airport Shuttle", "AC"];

const getMockTrains = (from, to) => {
  const seed = cyrb128(`trains_${from}_${to}`)[0];
  const rand = mulberry32(seed);
  
  const fromCap = capitalize(from);
  const toCap = capitalize(to);
  
  const count = Math.floor(rand() * 8) + 3; // 3 to 10 trains
  const results = [];
  
  for(let i=0; i<count; i++) {
    const tName = HORIZON_TRAINS[Math.floor(rand() * HORIZON_TRAINS.length)];
    const price = Math.floor(rand() * 3000) + 500;
    const durHrs = Math.floor(rand() * 20) + 2;
    const durMins = Math.floor(rand() * 60);
    
    let depHr = Math.floor(rand() * 24);
    let arrHr = (depHr + durHrs) % 24;
    
    results.push({
      id: `tr_${Math.floor(rand()*100000)}`,
      type: "train",
      name: tName,
      provider: "Indian Railways",
      from: fromCap,
      to: toCap,
      departureTime: `${depHr.toString().padStart(2, '0')}:00`,
      arrivalTime: `${arrHr.toString().padStart(2, '0')}:${durMins.toString().padStart(2, '0')}`,
      duration: `${durHrs}h ${durMins}m`,
      price: price,
      rating: +(rand() * 2 + 3).toFixed(1), // 3.0 to 5.0
      availableSeats: Math.floor(rand() * 150),
      class: rand() > 0.5 ? "AC 3-Tier" : "Sleeper"
    });
  }
  return results;
}

const getMockBuses = (from, to) => {
  const seed = cyrb128(`buses_${from}_${to}`)[0];
  const rand = mulberry32(seed);

  const fromCap = capitalize(from);
  const toCap = capitalize(to);

  const count = Math.floor(rand() * 12) + 5; // 5 to 16 buses
  const results = [];

  for(let i=0; i<count; i++) {
    const bName = HORIZON_BUSES[Math.floor(rand() * HORIZON_BUSES.length)];
    const price = Math.floor(rand() * 2000) + 400;
    const durHrs = Math.floor(rand() * 18) + 4;
    
    let depHr = Math.floor(rand() * 24);
    let arrHr = (depHr + durHrs) % 24;

    results.push({
      id: `bus_${Math.floor(rand()*100000)}`,
      type: "bus",
      name: bName,
      provider: "Private Operations",
      from: fromCap,
      to: toCap,
      departureTime: `${depHr.toString().padStart(2, '0')}:30`,
      arrivalTime: `${arrHr.toString().padStart(2, '0')}:15`,
      duration: `${durHrs}h 45m`,
      price: price,
      rating: +(rand() * 2 + 3).toFixed(1),
      availableSeats: Math.floor(rand() * 40),
      class: rand() > 0.5 ? "AC Sleeper" : "Non-AC Seater"
    });
  }
  return results;
}

const getMockHotels = (city) => {
  const seed = cyrb128(`hotels_${city}`)[0];
  const rand = mulberry32(seed);
  
  const destCap = capitalize(city);
  
  const count = Math.floor(rand() * 20) + 8; // 8 to 27 hotels
  const results = [];
  
  for(let i=0; i<count; i++) {
    const hChain = HOTEL_CHAINS[Math.floor(rand() * HOTEL_CHAINS.length)];
    const price = Math.floor(rand() * 12000) + 900;
    const starRating = Math.floor(rand() * 3) + 3; // 3 to 5 stars
    
    // Pick 3-6 amenities
    const hotelAmenities = [...AMENITIES].sort(() => 0.5 - rand()).slice(0, Math.floor(rand()*4) + 3);

    const imgId = Math.floor(rand() * 50) + 10;

    results.push({
      id: `htl_${Math.floor(rand()*100000)}`,
      name: `${hChain} ${destCap}`,
      provider: "TripSathi Stays",
      city: destCap,
      pricePerNight: price,
      rating: +(rand() * 1.5 + 3.5).toFixed(1), // 3.5 to 5.0
      location: `${destCap} City Center`,
      amenities: hotelAmenities,
      imageUrl: `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80&ixlib=rb-4.0.3&auto=format&fit=crop`,
      type: starRating >= 4 ? "Luxury Hotel" : "Standard Stay"
    });
  }
  return results;
}

const getMockTransport = (from, to) => {
  const trainResults = getMockTrains(from, to)
  const busResults = getMockBuses(from, to)
  return [...trainResults, ...busResults]
}

const getMockSearchResults = (from, to) => {
  const transport = getMockTransport(from, to)
  const hotelResults = getMockHotels(to)

  return {
    transport,
    hotels: hotelResults,
    meta: {
      from: capitalize(from),
      to: capitalize(to),
      transportCount: transport.length,
      hotelCount: hotelResults.length,
      source: "mock_procedural",
    },
  }
}

module.exports = {
  getMockTrains,
  getMockBuses,
  getMockHotels,
  getMockTransport,
  getMockSearchResults,
}
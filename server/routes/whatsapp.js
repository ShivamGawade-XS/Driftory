const express = require('express');
const router = express.Router();

// Simulated Redis Session Storage
const sessions = {};
function getSession(id) {
  if (!sessions[id]) sessions[id] = { step: 'IDLE', data: {} };
  return sessions[id];
}

router.post('/chat', (req, res) => {
  const { message, phoneId = 'default_user' } = req.body;
  if (!message) return res.status(400).json({ reply: "I didn't catch that. Could you repeat?" });

  const session = getSession(phoneId);
  let text = message.toLowerCase().trim();
  
  // Natural Language Normalize
  text = text.replace(/[.,!?]/g, "");

  // 1. Core Resets
  if (/\b(hi|hello|hey|namaste|reset|start over|menu)\b/.test(text)) {
    session.step = 'IDLE';
    session.data = {};
    return res.json({ 
      reply: "👋 Hi! I'm TripSathi's AI Assistant.\n\nI can help you with:\n🚆 Booking Trains & Buses\n🏝️ Recommending Packages\n🎫 Checking PNR statuses \n❌ Managing Cancellations\n\nJust tell me what you'd like to do naturally!"
    });
  }

  // == STATE: IDLE (NLP Intent Matching) ==
  if (session.step === 'IDLE') {
    
    // Intent: Check PNR
    if (/\b(pnr|status|ticket status|where is my train)\b/.test(text)) {
      const pnrNum = text.match(/\d{10}/);
      if (pnrNum) {
         return res.json({ reply: `🚂 *PNR Status for ${pnrNum[0]}*\n\nTrain: 12951 (Rajdhani)\nStatus: *CNF/B4/45* (Confirmed)\nChart: Not Prepared yet.` });
      } else {
         return res.json({ reply: "Please provide your 10-digit PNR number. (e.g. 'What is the status of PNR 4521367890?')" });
      }
    }

    // Intent: Recommend Trips
    if (/\b(recommend|suggest|places to visit|where should i go|trip ideas|holiday)\b/.test(text)) {
      if (text.includes("beach") || text.includes("sea")) {
        return res.json({ reply: "🌊 Based on your interest in beaches, I highly recommend our *Goa Beach Bliss* or *Kerala Backwaters* packages!\n\nYou can view and directly book them on our /packages page." });
      }
      if (text.includes("mountain") || text.includes("snow") || text.includes("adventure")) {
        return res.json({ reply: "⛰️ For mountain adventures, the *Manali Adventure Camp* or *Kedarnath Yatra Elite* are fantastic choices right now!\n\nWould you like me to book one of them for you?" });
      }
      return res.json({ reply: "🗺️ We have some incredible trending packages! \n\nAre you looking for a 'heritage', 'beach', 'adventure', or 'pilgrimage' trip? Let me know!" });
    }

    // Intent: Book Transport (e.g., "I want to go from Delhi to Mumbai")
    const routeMatch = text.match(/\b(?:from\s+)?([a-z]+)\s+to\s+([a-z]+)\b/);
    if (routeMatch && routeMatch[1] !== 'how' && routeMatch[1] !== 'where') {
      const fromCity = routeMatch[1].charAt(0).toUpperCase() + routeMatch[1].slice(1);
      const toCity = routeMatch[2].charAt(0).toUpperCase() + routeMatch[2].slice(1);
      
      session.step = 'SELECTING_RIDE';
      session.data.from = fromCity;
      session.data.to = toCity;

      return res.json({
        reply: `🚆 Found 3 excellent options from *${fromCity}* to *${toCity}*!\n\n1. Rajdhani Express — ₹1,450 (AC 3-Tier)\n2. Duronto Express — ₹1,280 (Sleeper)\n3. RedBus Sleeper — ₹850 (AC Volvo)\n\nReply with the *number* to proceed with booking! 🎫`
      });
    }

    // Intent: Cancellations
    if (/\b(cancel|refund|delete my booking|money back)\b/.test(text)) {
      return res.json({ reply: "🛑 To cancel a booking and process a refund:\n\n1. Navigate to your /dashboard\n2. Click 'Cancel' under your Active Bookings.\n\nRefunds to the original payment method take 5-7 business days."});
    }
    
    // Intent: Chit-chat / Weather
    if (/\b(weather|temperature|climate)\b/.test(text)) {
      return res.json({ reply: "☀️ I'm not a meteorologist, but generally India is very sunny right now! I recommend packing light, breathable cottons for most of our destinations!"});
    }

    // Unmatched Intent
    return res.json({ reply: "I'm still learning! Could you try rephrasing that? (e.g. Try saying 'I want to travel from Delhi to Agra' or 'Recommend a beach trip')" });
  }

  // == STATE: SELECTING RIDE ==
  if (session.step === 'SELECTING_RIDE') {
    const choiceMatch = text.match(/\b(1|2|3|one|two|three|first|second|third)\b/);
    if (choiceMatch) {
      session.step = 'BOOKING_DETAILS';
      const c = choiceMatch[1];
      let trainName = 'Rajdhani Express';
      if (c === '2' || c === 'two' || c === 'second') trainName = 'Duronto Express';
      if (c === '3' || c === 'three' || c === 'third') trainName = 'RedBus Sleeper';
      
      session.data.train = trainName;
      return res.json({
        reply: `✅ Excellent choice. *${trainName}* selected!\n\nTo lock in this ticket, please provide your primary passenger details.\n\nReply safely in this format:\n*Name, Age, Gender*\n(Example: Raj Kumar, 28, M)`
      });
    }
    return res.json({ reply: "Please reply with '1', '2', or '3' for the ride you'd like to select! Or type 'reset'." });
  }

  // == STATE: BOOKING DETAILS ==
  if (session.step === 'BOOKING_DETAILS') {
    const details = text.split(',');
    if (details.length >= 3) {
      session.step = 'IDLE'; 
      const bookRef = `TS${Math.floor(10000 + Math.random() * 90000)}`;
      return res.json({
        reply: `🎉 *Success! Your Booking is Confirmed!*\n\nReference: *${bookRef}*\nPassenger: ${details[0].trim().toUpperCase()}\nTransport: ${session.data.train}\n\nYour e-ticket is permanently saved to your Dashboard. Safe travels! ✨`
      });
    }
    return res.json({ reply: "Hmm, that format didn't look quite right. Please reply exactly like: *Raj Kumar, 28, M*" });
  }

  // Fallback
  return res.json({ reply: "Oops, something went wrong on my circuits. Type 'reset'." });
});

module.exports = router;

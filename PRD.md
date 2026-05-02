# Product Requirements Document (PRD)
## TripSathi — Unified Indian Travel Planning Platform

**Team:** Crimson Syndicate  
**Version:** 1.0 (MVP)  
**Status:** Complete  

---

## 1. Overview

### 1.1 Product Vision
TripSathi is a unified travel planning platform that aggregates trains, buses, hotels, curated travel packages, and itinerary management into a single, accessible experience built for every Indian traveler — with a special focus on Tier-2/3 city users.

### 1.2 Problem Statement
India's travel ecosystem is completely fragmented. No single platform connects IRCTC (trains), redBus (buses), and MakeMyTrip/OYO (hotels). Users spend 3–5 hours and 4+ apps to plan a single trip, missing better routes and cheaper options hidden across platforms. 800M+ Indians are underserved, with 600M+ Tier-2/3 city users having zero access to a unified, accessible tool.

### 1.3 Opportunity
- India travel market size: **$75B (2025)**
- Daily domestic transport users: **23M+**
- Average revenue per booking: **~₹1,500**
- Potential commission per booking: **2–5%**

---

## 2. Goals & Success Metrics

### 2.1 MVP Goals
- Launch a fully functional web app that aggregates train + bus + hotel results in a single search
- Provide a curated travel packages marketplace with seasonal deals and group discounts
- Support mock API fallback so the product is demo-ready on Day 1
- Target Tier-2/3 users with a multilingual UI (5 languages), optimized for low-bandwidth and low-end Android devices
- Offer an in-app AI chatbot for instant travel assistance and booking support

### 2.2 Key Metrics (KPIs)

| Metric | Target (6 months) |
|---|---|
| Registered Users | 10,000+ |
| Monthly Active Users | 5,000+ |
| Average Session Duration | > 4 minutes |
| Searches per User per Month | 3+ |
| Itineraries Saved | 2,000+ |
| Premium Conversion Rate | 5% |

---

## 3. User Personas

### Persona 1 — Ravi, Budget Student Traveler
- Age: 21, Engineering student in Nagpur
- Travels 2–3x per year for college and family visits
- Pain: Jumps between IRCTC, redBus, and Google to compare options
- Need: Cheapest route from point A to B in one view

### Persona 2 — Sunita, Family Trip Planner
- Age: 38, homemaker in Indore
- Plans annual family vacations for 4–5 people
- Pain: Needs to book train + hotel + local bus separately; can't share plan with husband easily
- Need: Bundle search + itinerary sharing + group expense splitting

### Persona 3 — Deepak, Tier-3 First-Timer
- Age: 29, small business owner in Raipur
- Low digital literacy, prefers Hindi UI
- Pain: English-only interfaces, slow load times on 3G
- Need: Hindi UI, works on basic Android, fast on slow internet

---

## 4. Features & Requirements

### 4.1 Core Features (MVP)

#### F1 — Unified Multi-Modal Search
- User inputs: Source city, destination city, travel dates
- System returns: Available trains, buses, and hotels in a single unified results page
- Procedurally generated realistic results for any Indian city pair
- Supports: real API + mock JSON fallback

#### F2 — Smart Route Aggregation & Ranking
- Aggregates results from IRCTC API, Bus Aggregator APIs (redBus/AbhiBus), and Govt transport feeds
- Ranks results by: price (low to high), duration, comfort/rating
- Highlights combo routes not available on a single platform

#### F3 — Price Comparison View
- Side-by-side pricing for transport modes
- Hotel options filterable by rating, price, proximity
- Savings indicator vs. booking separately

#### F4 — Itinerary Saver & Sharer
- Logged-in users can save a complete trip (transport + hotel)
- System generates a unique shareable link per itinerary
- View saved itineraries from account dashboard

#### F5 — User Authentication
- Email + password sign-up/login
- JWT-based session management
- Persistent login across sessions via localStorage

#### F6 — Multilingual UI (5 Languages)
- Language toggle in header with support for: **English, Hindi, Tamil, Telugu, Marathi**
- All UI strings i18n-ready via JSON locale dictionaries
- Seamless switching without page reload

#### F7 — Curated Travel Packages
- Browse 15+ professionally curated travel packages across India
- Categories: Seasonal Hot Deals, Group Deals, Top Rated packages
- Each package includes: itinerary, pricing, duration, ratings, and cover images
- "See More" navigation to explore the full packages catalog

#### F8 — AI Travel Chatbot
- In-app chat widget accessible from every page
- Natural language processing for travel queries (booking, recommendations, PNR lookup)
- Stateful conversation flow — maintains context across messages
- Supports multilingual greetings matching the selected UI language
- Custom support contact integration (email & phone)

#### F9 — Price Alerts System
- Users can set price alerts for specific routes
- Alert management dashboard

#### F10 — Group Expense Splitter
- Split travel expenses among group members
- Track who owes whom with a clean dashboard

#### F11 — Theme System
- **Light/Dark Mode Toggle** — Smooth CSS transitions, persistent preference via localStorage
- **Stranger Things "Upside Down" Theme** — 1980s nostalgia hackathon theme with neon-red glow effects, flickering headings, crimson gradients, and deep dark aesthetics
- 4 theme combinations: Light Default, Dark Default, Stranger Light, Stranger Dark

#### F12 — Premium UI Effects
- Scroll-triggered entrance reveal animations on all sections
- 3D perspective tilt on hover for feature and route cards
- Parallax floating background blobs in the hero section
- Custom canvas-based trailing cursor with particle physics (desktop only)
- Animated number counters that count up on scroll reveal
- Magnetic hover effect on CTA buttons
- Stagger reveal animations for card grids
- Smooth branded page loader on initial load

### 4.2 Deferred Features (Post-MVP)

- Native mobile apps (iOS & Android)
- Real-time seat availability via live GDS APIs
- In-app payment gateway (Razorpay integration)
- AI-powered trip suggestions via LLM (Gemini API integration ready)
- Offline mode / PWA (service worker scaffolded)

---

## 5. User Stories

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-01 | Traveler | Search trains + buses + hotels in one step | I don't waste time on multiple apps |
| US-02 | Traveler | See results ranked by price and duration | I can find the best value option quickly |
| US-03 | Logged-in user | Save my trip plan | I can refer back and not lose my research |
| US-04 | User | Share my itinerary via a link | My family can see the full plan without me re-explaining |
| US-05 | Regional speaker | Use the app in my language (Hindi/Tamil/Telugu/Marathi) | I feel comfortable and understand everything |
| US-06 | Budget traveler | See price comparison across modes | I know I'm getting the cheapest option |
| US-07 | Traveler | Browse curated travel packages | I can discover pre-planned trips with great deals |
| US-08 | User | Chat with a travel assistant | I get instant help without leaving the app |
| US-09 | Group traveler | Split expenses with friends | Everyone knows exactly what they owe |
| US-10 | Night-owl user | Switch to dark mode | The app is comfortable on my eyes at night |

---

## 6. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Page Load Time (3G) | < 3 seconds |
| Search Response Time | < 2 seconds (cached) / < 5s (live) |
| Mobile Responsiveness | Works on 320px+ screens |
| Uptime | 99.5% |
| Data Caching | 15-minute Redis cache for transport data |
| Security | HTTPS, JWT, input sanitization, rate limiting |
| Theme Persistence | Preferences survive page refresh/navigation |
| Animation Performance | 60fps smooth on modern browsers |

---

## 7. Roadmap

### Phase 1 — 0–6 Months: Launch Free Tier
- Ship MVP with mock + real API integration
- Focus on user acquisition and retention
- Multilingual UI, mobile-first design
- AI chatbot for instant support

### Phase 2 — 6–12 Months: Activate Revenue
- Commission model on hotel bookings
- Launch ₹99/month premium plan (price alerts, unlimited saves, ad-free)
- Live payment gateway integration

### Phase 3 — 12–24 Months: B2B Expansion
- API licensing to state tourism boards and travel agents
- Target ₹10L Monthly Recurring Revenue (MRR)
- Native mobile apps

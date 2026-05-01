# Design Document
## TripSathi — Unified Indian Travel Planning Platform

**Team:** Crimson Syndicate  
**Version:** 1.0 (MVP)  

---

## 1. System Architecture

TripSathi follows a **4-layer architecture** with a unidirectional data flow from user to data sources and back.

```
Layer 1: User (Browser/Mobile)
         │
Layer 2: React Frontend (Next.js 14)
         │  ├── Theme System (Light/Dark/Stranger Things)
         │  ├── i18n (5 Languages)
         │  ├── Premium Effects (3D Tilt, Parallax, Custom Cursor)
         │  └── AI Chatbot Widget
         │
Layer 3: Node.js / Express API
         │  ├── Route Aggregation Engine
         │  ├── NLP Chatbot Engine
         │  ├── Packages Marketplace
         │  └── Price Alerts + Group Split
         │
Layer 4: MongoDB Atlas + Redis Cache
         │
    ┌────┴────────────────┐
    │                     │
Transport Layer     Hotel Layer
IRCTC, redBus,      OYO, MMT,
AbhiBus, Govt       Goibibo
    │                     │
    └────────┬────────────┘
             │
         Maps Layer
       Google Maps API
```

---

## 2. Data Flow — 6-Step User Journey

| Step | Actor | Action |
|---|---|---|
| **1. User Input** | User | Enters source city, destination city, and travel dates |
| **2. API Request** | Frontend | Sends `GET /api/v1/search?from=&to=&date=` to Express API |
| **3. Data Fetching** | Backend | Fetches from Transport API + Hotel API simultaneously (`Promise.all`) |
| **4. Aggregation** | Backend | Engine sorts & ranks results by price, duration, and rating |
| **5. Display Results** | Frontend | User sees a unified comparison view with all transport + hotel options |
| **6. Save & Share** | Backend + DB | Itinerary saved to MongoDB → shareable link generated via UUID token |

---

## 3. Component Design

### 3.1 Frontend Components

```
/components
  ├── search/
  │     ├── CityInput.tsx           — Autocomplete city selector
  │     ├── DatePicker.tsx          — Travel date selector
  │     └── SearchBar.tsx           — Combined search form with CTA
  │
  ├── results/
  │     ├── TransportCard.tsx       — Individual train/bus result
  │     ├── HotelCard.tsx           — Individual hotel result
  │     └── SortFilter.tsx          — Sort by price/duration/rating
  │
  ├── itinerary/
  │     ├── ItineraryBuilder.tsx    — Add/remove items to trip plan
  │     └── SaveButton.tsx          — Saves to MongoDB via API
  │
  ├── home/
  │     ├── Hero.tsx                — Animated hero with parallax blobs
  │     ├── Features.tsx            — 3D tilt feature cards with stagger reveal
  │     ├── PopularRoutes.tsx       — Tilt cards with emoji micro-interactions
  │     └── TrendingSections.tsx    — Seasonal, Group, Top Rated packages
  │
  ├── layout/
  │     ├── Header.tsx              — Nav + theme toggles + language toggle + back button
  │     ├── Footer.tsx              — Mega footer with themed Logo variant
  │     └── MobileNav.tsx           — Bottom tab bar for mobile
  │
  ├── effects/
  │     ├── MotionEffects.tsx       — Reveal, Tilt3D, Magnetic, Parallax, AnimatedCounter, StaggerReveal
  │     ├── CustomCursor.tsx        — Canvas-based trailing cursor with particle physics
  │     └── PageLoader.tsx          — Branded splash loader with spinning icon + progress bar
  │
  ├── ui/
  │     ├── ChatWidget.tsx          — In-app AI chatbot with NLP backend proxy
  │     ├── ThemeToggle.tsx         — Light/Dark + Stranger Things theme buttons
  │     ├── LanguageToggle.tsx      — 5-language dropdown selector
  │     ├── Logo.tsx                — SVG logo with theme-aware colors + footer variant
  │     ├── Spinner.tsx             — Loading spinner
  │     ├── Skeleton.tsx            — Shimmer skeleton loaders
  │     └── EmptyState.tsx          — Empty state placeholder
  │
  ├── auth/
  │     └── LoginForm.tsx, RegisterForm.tsx
  │
  └── dashboard/
        └── TripCard.tsx            — Saved trip card with actions

/context
  ├── AuthContext.tsx               — JWT auth state + login/logout/register
  ├── LanguageContext.tsx           — i18n locale state + translation helper
  └── ThemeContext.tsx              — Light/Dark mode + Stranger Things flavor
```

### 3.2 Backend API Routes

```
Auth:
  POST   /api/v1/auth/register      — Create account
  POST   /api/v1/auth/login         — Login, returns JWT
  GET    /api/v1/auth/me            — Fetch current user profile

Search:
  GET    /api/v1/search             — Unified search (transport + hotels)

Itinerary:
  POST   /api/v1/itinerary          — Save a new itinerary
  GET    /api/v1/itinerary/:id      — Fetch itinerary by ID (for share links)
  GET    /api/v1/itinerary/user     — Fetch all itineraries for logged-in user
  DELETE /api/v1/itinerary/:id      — Delete an itinerary

Packages:
  GET    /api/v1/packages           — Browse all curated packages
  GET    /api/v1/packages/trending  — Seasonal deals, group deals, top rated
  GET    /api/v1/packages/:slug     — Individual package detail

Chatbot:
  POST   /api/v1/whatsapp/chat      — NLP message handler (intent parsing)

Alerts:
  GET    /api/v1/alerts             — Price alert management

Split:
  POST   /api/v1/split              — Group expense splitting

FAQs:
  GET    /api/v1/faqs               — Categorized FAQ data
```

---

## 4. Database Schema

### 4.1 Users Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "passwordHash": "string (bcrypt)",
  "language": "enum: ['en', 'hi', 'ta', 'te', 'mr']",
  "createdAt": "Date"
}
```

### 4.2 Itineraries Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users)",
  "title": "string",
  "from": "string",
  "to": "string",
  "travelDate": "Date",
  "transport": [
    {
      "type": "enum: ['train', 'bus']",
      "provider": "string",
      "departureTime": "string",
      "arrivalTime": "string",
      "price": "number",
      "duration": "string"
    }
  ],
  "hotels": [
    {
      "name": "string",
      "provider": "string",
      "pricePerNight": "number",
      "rating": "number",
      "location": "string"
    }
  ],
  "shareToken": "string (UUID, unique)",
  "createdAt": "Date"
}
```

### 4.3 Search History Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users, optional)",
  "from": "string",
  "to": "string",
  "date": "Date",
  "resultsCount": "number",
  "createdAt": "Date"
}
```

---

## 5. Aggregation Engine Design

The core of TripSathi's value is the **Route Aggregation Engine** in the backend.

```
Input: { from, to, date }
         │
         ▼
┌─────────────────────────┐
│   Check Redis Cache      │  → Cache hit? → Return cached results
└────────────┬────────────┘
             │ Cache miss
             ▼
┌─────────────────────────────────────────────┐
│  Parallel API Fetch (Promise.all)            │
│  ├── fetchIRCTC(from, to, date)              │
│  ├── fetchRedBus(from, to, date)             │
│  └── fetchMockFallback(from, to, date)       │
└────────────────────────┬────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────┐
│  Normalize Results to Unified Schema         │
│  { type, provider, price, duration, rating } │
└────────────────────────┬────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────┐
│  Sort & Rank                                 │
│  ├── Sort by price (default)                 │
│  ├── Sort by duration                        │
│  └── Sort by rating / comfort                │
└────────────────────────┬────────────────────┘
                         │
                         ▼
              Store in Redis (TTL: 15 min)
                         │
                         ▼
              Return to Frontend
```

---

## 6. Caching Strategy

| Layer | Technology | TTL | Scope |
|---|---|---|---|
| Transport search results | Redis | 15 minutes | `search:{from}:{to}:{date}` |
| Hotel search results | Redis | 15 minutes | `hotels:{city}:{date}` |
| User session | JWT | 7 days | Client-side |
| Theme/Language prefs | localStorage | Persistent | Client-side |
| Static assets | Vercel CDN | Immutable | Global CDN edge |

---

## 7. UI/UX Design Principles

### 7.1 Mobile-First
- All layouts designed for 320px minimum screen width
- Bottom navigation bar on mobile (Home, Search, Packages, Saved, Profile)
- Touch targets minimum 44×44px

### 7.2 Performance for Low-Bandwidth
- SSR via Next.js — first contentful paint under 3s on 3G
- Lazy loading for hotel and package images
- Redis caching reduces repeat API latency to ~50ms

### 7.3 Accessibility & Language
- Language toggle supporting **5 languages**: English, हिंदी, தமிழ், తెలుగు, मराठी
- i18n via JSON locale dictionaries — all UI strings externalized
- High contrast mode support via Dark Mode
- Focus-visible outlines on all interactive elements

### 7.4 Theme System
- **Light Mode** — Clean blue/white professional aesthetic
- **Dark Mode** — Deep navy backgrounds, muted text, vibrant accents
- **Stranger Things Mode** — 1980s neon-red "Upside Down" with glowing headings, crimson gradients, pulsing neon card borders
- Smooth 0.4s CSS transitions between all theme states
- Preferences persisted via `localStorage`

### 7.5 Premium Micro-Interactions
- Scroll-triggered entrance reveal (Intersection Observer)
- 3D perspective tilt on hover (cards)
- Parallax floating background blobs
- Canvas-rendered custom cursor with trailing particles
- Animated counters (count up on scroll)
- Magnetic hover effect on CTA buttons
- Stagger reveal for card grids
- Branded page loader with spinning icon and progress bar
- Smooth page transition animations

### 7.6 Key Screens
| Screen | Description |
|---|---|
| Home / Search | Animated hero, feature cards, popular routes, trending sections |
| Results Page | Unified list of transport + hotels, sort/filter bar |
| Packages | Curated travel packages with seasonal/group/top-rated categories |
| Itinerary Builder | Add/remove items to trip plan, save + share |
| Saved Trips Dashboard | List of saved itineraries per user |
| Shared Itinerary View | Read-only view for shared links (no login required) |
| FAQ | Categorized help center with support contacts |
| Contact | HQ address, support email & phone, contact form |

---

## 8. Security Design

| Concern | Approach |
|---|---|
| Authentication | JWT tokens (7-day expiry, HTTP-only cookies) |
| Password storage | bcrypt (salt rounds: 12) |
| API key protection | All third-party keys in server-side env vars only |
| Input validation | `express-validator` on all API inputs |
| CORS | Whitelist only Vercel frontend domain |
| Rate limiting | `express-rate-limit` — 100 req/min per IP |
| HTTP Headers | `helmet` for secure headers |

---

## 9. Mock API Fallback

To ensure a complete demo without live API keys:

- A `/data/mock/` directory holds static JSON fixtures for trains, buses, hotels, packages, FAQs, reviews, and alerts
- Backend detects `USE_MOCK_API=true` in env and routes all external calls to local mock files
- Procedural generation engine creates realistic transport/hotel options for any Indian city pair
- All features (search, aggregation, save, share, packages, chatbot) work fully in mock mode

---

## 10. Deployment Architecture

```
GitHub (main branch)
    │
    ├──► Vercel (Frontend CI/CD)
    │    └── Auto-deploy on push
    │    └── Edge CDN globally
    │
    └──► Render / Railway (Backend CI/CD)
         └── Auto-deploy on push
         └── Node.js 20 server
         └── Connected to MongoDB Atlas + Redis
```

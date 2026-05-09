# Tech Stack
## TripSathi — Unified Indian Travel Planning Platform

**Team:** Crimson Syndicate

---

## Architecture Overview

TripSathi follows a layered **3-tier architecture** — UI Layer, Logic Layer, and Data Layer — deployed on cloud platforms with a clear separation of concerns.

```
┌─────────────────────────────────────┐
│         User (Browser / Mobile)      │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│     React / Next.js 14 Frontend      │  ← Layer 1: UI Layer
│     (Vercel — SSR + CDN)             │
│     + Theme System (Light/Dark/      │
│       Stranger Things)               │
│     + Premium Animation Effects      │
└────────────────┬────────────────────┘
                 │ REST API calls
┌────────────────▼────────────────────┐
│     Node.js 20 + Express.js API      │  ← Layer 2: Logic Layer
│     (Render / Railway)               │
│     + NLP Chatbot Engine             │
│     + Route Aggregation Engine       │
└──────────┬───────────────┬──────────┘
           │               │
┌──────────▼──────┐  ┌─────▼───────────┐
│  MongoDB Atlas  │  │   Redis Cache   │  ← Layer 3: Data Layer
│  (Primary DB)   │  │  (15-min TTL)   │
└─────────────────┘  └─────────────────┘
           │
┌──────────▼──────────────────────────┐
│           External APIs              │
│  Transport | Hotels | Maps | Mock    │
└─────────────────────────────────────┘
```

---

## 1. Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.x | Component-based UI framework |
| **Next.js** | 14 | SSR, App Router, performance optimization |
| **TypeScript** | 5.x | Type-safe development |
| **Tailwind CSS** | 3.x | Responsive, utility-first styling |
| **CSS Custom Properties** | — | Theme system (Light/Dark/Stranger Things) |
| **Google Fonts** | Inter, Outfit | Premium typography |
| **Canvas API** | — | Custom cursor with particle trail effects |
| **Intersection Observer** | — | Scroll-triggered entrance reveal animations |

### Key Frontend Decisions
- **Next.js SSR** — Server-side rendering ensures fast load times on mobile networks and low-bandwidth environments (critical for Tier-2/3 users)
- **Tailwind CSS** — Rapid responsive UI development, optimized for 320px+ screen sizes (entry-level Android phones)
- **CSS Custom Properties Theme System** — 4 theme combinations (Light Default, Dark Default, Stranger Light, Stranger Dark) driven by `data-theme-mode` and `data-theme-flavor` attributes on `<html>`, with smooth 0.4s transitions
- **i18n-ready** — All strings abstracted for 5 languages (English, Hindi, Tamil, Telugu, Marathi) via JSON locale dictionaries
- **Premium Effects Stack** — Scroll reveal, 3D tilt, parallax, custom cursor, magnetic buttons, animated counters, stagger animations, page loader

---

## 2. Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 20 LTS | JavaScript runtime |
| **Express.js** | 4.18.2 | REST API framework |
| **bcryptjs** | 2.4.3 | Password hashing |
| **jsonwebtoken** | 9.0.2 | JWT session management |
| **helmet** | 7.1.0 | HTTP security headers |
| **express-rate-limit** | 7.1.5 | API rate limiting |
| **express-validator** | 7.0.1 | Input sanitization |
| **uuid** | 9.0.0 | Shareable link token generation |

### Key Backend Responsibilities
- Route aggregation: fetches from Transport API + Hotel API simultaneously (parallel `Promise.all` calls)
- Aggregation engine: sorts & ranks results by price, duration, and rating
- Itinerary CRUD: create, read, update, delete for saved trip plans
- Shareable link generation: UUID-based unique links per saved itinerary
- NLP Chatbot engine: regex-based intent parser for booking, PNR, recommendations
- Packages API: curated travel packages with seasonal/group/top-rated categorization
- Price Alerts API: route-based alert management
- Group Split API: expense splitting calculations
- Mock API fallback: procedurally generated results + static JSON when live API keys unavailable

### API Design
- Architecture: REST
- Auth: JWT (JSON Web Tokens) for protected routes
- Format: JSON request/response
- Versioning: `/api/v1/...`

### API Routes

```
Auth:
  POST   /api/v1/auth/register       — Create account
  POST   /api/v1/auth/login          — Login, returns JWT
  GET    /api/v1/auth/me             — Fetch current user profile

Search:
  GET    /api/v1/search              — Unified search (transport + hotels)
  GET    /api/v1/search/transport    — Transport-only results
  GET    /api/v1/search/hotels       — Hotel-only results

Itinerary:
  POST   /api/v1/itinerary           — Save a new itinerary
  GET    /api/v1/itinerary/:id       — Fetch itinerary by ID
  GET    /api/v1/itinerary/user      — Fetch all for logged-in user
  DELETE /api/v1/itinerary/:id       — Delete an itinerary

Packages:
  GET    /api/v1/packages            — List all packages
  GET    /api/v1/packages/trending   — Seasonal, group deals, top rated
  GET    /api/v1/packages/:slug      — Package detail

Chatbot:
  POST   /api/v1/whatsapp/chat       — NLP chatbot message handler

Extras:
  GET    /api/v1/alerts              — Price alerts management
  POST   /api/v1/split               — Group expense splitting
  GET    /api/v1/faqs                — FAQ data
```

---

## 3. Database & Caching

| Technology | Purpose |
|---|---|
| **MongoDB Atlas** | Primary database — flexible schema for itineraries, search history, user preferences |
| **Redis Cache** | 15-minute TTL cache for transport search results to reduce API calls and improve response time |

### MongoDB Collections
```
users         → { _id, name, email, passwordHash, language, createdAt }
itineraries   → { _id, userId, title, transport[], hotels[], shareToken, createdAt }
searchHistory → { _id, userId, from, to, date, results[], createdAt }
```

### Caching Strategy
- Transport search results cached in Redis with key: `search:{from}:{to}:{date}`
- TTL: 15 minutes (real-time sync optimization)
- Cache miss → fetch from external APIs → store in Redis → return to client

---

## 4. External APIs

### Transport Layer
| API | Provider | Data |
|---|---|---|
| IRCTC API | Indian Railways | Train schedules, availability, fares |
| redBus / AbhiBus API | Bus aggregators | Bus routes, timings, pricing |
| Govt transport feeds | State RTCs | State bus data |

### Hotel Layer
| API | Provider | Data |
|---|---|---|
| OYO API | OYO Rooms | Budget hotel listings |
| MakeMyTrip feed | MMT | Hotel inventory + pricing |
| Goibibo listings | Goibibo | Hotel availability |

### Maps Layer
| API | Provider | Use |
|---|---|---|
| Google Maps API | Google | Route display, distance calculation, map embeds |

### Fallback
| Source | Purpose |
|---|---|
| Mock APIs (Static JSON) | Full demo without live API keys — demo-ready on hackathon day |
| Procedural Generation | Dynamic transport/hotel results for any Indian city pair |

---

## 5. Deployment & DevOps

| Tool | Purpose |
|---|---|
| **Vercel** | Frontend hosting — automatic CI/CD from GitHub, global CDN |
| **Render / Railway** | Backend hosting — Node.js server with auto-deploy |
| **MongoDB Atlas** | Managed cloud database (free tier for MVP) |
| **GitHub** | Version control, branch-based workflow |
| **Postman** | API testing and documentation |

---

## 6. Development Environment

```bash
# Prerequisites
Node.js 20 LTS
npm 9+
MongoDB Atlas account (or local MongoDB)
Redis (local or Upstash for cloud)

# Environment Variables (.env)
MONGODB_URI=
REDIS_URL=
JWT_SECRET=
GOOGLE_MAPS_API_KEY=
IRCTC_API_KEY=
REDBUS_API_KEY=
OYO_API_KEY=
MMT_API_KEY=
USE_MOCK_API=true   # Set to false in production
```

---

## 7. Tech Stack Summary Card

```
Frontend    → Next.js 14 + React 18 + TypeScript + Tailwind CSS
Theming     → CSS Custom Properties (Light/Dark/Stranger Things)
Effects     → Canvas cursor, Intersection Observer reveals, 3D tilt, Parallax
Backend     → Node.js 20 + Express.js 4 (REST)
Chatbot     → Regex NLP intent engine (with Gemini API upgrade path)
Database    → MongoDB Atlas + Redis Cache
APIs        → IRCTC, redBus/AbhiBus, OYO, MMT, Goibibo, Google Maps
i18n        → 5 languages (EN, HI, TA, TE, MR)
Security    → JWT + bcrypt + helmet + rate-limit + express-validator
Deploy      → Vercel (FE) + Render/Railway (BE)
Fallback    → Static JSON + Procedural Mock APIs
```

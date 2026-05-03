# TripSathi 🚆🚌🏨

**One Platform. Every Indian Journey.**

TripSathi is a unified travel planning platform that lets you search trains, buses, and hotels in one place. Compare prices, build itineraries, browse curated packages, and share trip plans — designed for every Indian traveler with premium UI and multilingual support.

### 🌍 Live Deployment
- **Frontend App:** [https://tripsathi-web.vercel.app](https://tripsathi-web.vercel.app)
- **Backend API:** [https://tripsathi-api.vercel.app](https://tripsathi-api.vercel.app)

## ✨ Features

### Core
- **Unified Search** — Search trains, buses, and hotels from a single search bar
- **Price Comparison** — Side-by-side pricing across multiple providers
- **Itinerary Builder** — Select transport + hotel, save your complete trip plan
- **Share Trips** — Share itineraries with family via a simple link
- **Curated Packages** — 15+ professionally curated travel packages with seasonal deals and group discounts
- **Payment Gateway Simulator** — Fully functional UI mock supporting UPI, Cards, Net Banking, and Wallets with processing animations.

### Intelligence & Architecture
- **In-Memory Dual Persistence** — Safe serverless caching using backend `/tmp` and frontend `localStorage` to guarantee hackathon demo survival.
- **Auto Mock-Mode** — Zero-config auth and booking emulation when MongoDB is disconnected.
- **AI Travel Chatbot** — NLP-powered in-app assistant for booking, PNR lookup, and trip recommendations
- **Price Alerts** — Set alerts for specific routes and get notified on price drops
- **Group Expense Splitter** — Split travel costs among group members

### Experience
- **5 Languages** — English, Hindi, Tamil, Telugu, Marathi (switchable without reload)
- **Light/Dark Mode** — Smooth theme switching with persistent preferences
- **Stranger Things Theme** — 1980s neon-red "Upside Down" hackathon special
- **Premium Effects** — 3D tilt cards, parallax, custom cursor, scroll reveals, animated counters, page loader
- **Mobile First** — Responsive design with bottom navigation for mobile

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS 3, CSS Custom Properties, Google Fonts (Inter, Outfit) |
| Effects | Canvas API, Intersection Observer, CSS Animations |
| Backend | Express.js 4, Node.js 20 |
| Database | MongoDB (Mongoose ODM) |
| Caching | Redis |
| Auth | JWT (JSON Web Tokens) + bcrypt |
| Security | helmet, express-rate-limit, express-validator |
| i18n | 5 languages via JSON locale dictionaries |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Redis (optional, for caching)

### Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start dev server
npm run dev
```

The frontend runs on [http://localhost:3000](http://localhost:3000)

### Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start dev server
npm run dev
```

The backend runs on [http://localhost:5000](http://localhost:5000)

### Environment Variables

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

**Backend** (`server/.env`):
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/tripsathi
JWT_SECRET=your-secret-key-here
REDIS_URL=redis://localhost:6379
USE_MOCK_API=true
```

## 📁 Project Structure

```
TripSathi/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Homepage (Hero, Features, Routes, Trending)
│   ├── search/             # Unified search results
│   ├── packages/           # Curated travel packages marketplace
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── dashboard/          # Saved trips
│   ├── profile/            # User profile
│   ├── shared/[token]/     # Shared itinerary view
│   ├── faq/                # Help center
│   ├── contact/            # Contact page
│   ├── about/              # About us
│   ├── alerts/             # Price alerts
│   ├── split/              # Group expense splitter
│   ├── whatsapp/           # WhatsApp bot info
│   ├── book/               # Booking flow
│   ├── privacy/            # Privacy policy
│   ├── terms/              # Terms of service
│   ├── refund/             # Refund policy
│   └── cancellation/       # Cancellation policy
├── components/
│   ├── layout/             # Header, Footer, MobileNav
│   ├── home/               # Hero, Features, PopularRoutes, TrendingSections
│   ├── search/             # CityInput, DatePicker, SearchBar
│   ├── results/            # TransportCard, HotelCard, SortFilter
│   ├── itinerary/          # ItineraryBuilder, SaveButton
│   ├── dashboard/          # TripCard
│   ├── effects/            # MotionEffects, CustomCursor, PageLoader
│   └── ui/                 # ChatWidget, ThemeToggle, LanguageToggle, Logo, Spinner
├── context/                # AuthContext, LanguageContext, ThemeContext
├── hooks/                  # useSearch
├── lib/                    # api.ts, cities.ts, i18n.ts
├── server/                 # Express.js backend
│   ├── controllers/        # Route handlers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes (auth, search, itinerary, packages, whatsapp, etc.)
│   ├── middleware/         # Auth, validation, security
│   ├── services/           # Aggregation, ranking, mock
│   ├── data/mock/          # Mock JSON data (trains, buses, hotels, packages, FAQs)
│   ├── utils/              # Helper utilities
│   └── validators/         # Input validation schemas
└── public/locales/         # i18n translation files (en, hi, ta, te, mr)
```

## 🔌 API Endpoints

### Auth
- `POST /api/v1/auth/register` — Create account
- `POST /api/v1/auth/login` — Login
- `GET /api/v1/auth/me` — Get current user (protected)

### Search
- `GET /api/v1/search?from=Delhi&to=Mumbai` — Unified search

### Itinerary
- `POST /api/v1/itinerary` — Create itinerary (protected)
- `GET /api/v1/itinerary` — Get my itineraries (protected)
- `GET /api/v1/itinerary/shared/:token` — View shared itinerary
- `DELETE /api/v1/itinerary/:id` — Delete itinerary (protected)

### Packages
- `GET /api/v1/packages` — Browse all packages
- `GET /api/v1/packages/trending` — Seasonal, group, top-rated deals
- `GET /api/v1/packages/:slug` — Package detail

### Chatbot
- `POST /api/v1/whatsapp/chat` — NLP message handler

### Extras
- `GET /api/v1/alerts` — Price alerts
- `POST /api/v1/split` — Group expense splitting
- `GET /api/v1/faqs` — FAQ data

## 🎨 Theme System

TripSathi includes a powerful theme system with 4 combinations:

| Theme | Description |
|---|---|
| ☀️ Light Default | Clean blue/white professional aesthetic |
| 🌙 Dark Default | Deep navy, muted text, vibrant accents |
| 👾 Stranger Light | Neon-red glow on lighter background |
| 🔮 Stranger Dark | Full "Upside Down" — crimson, neon glow, flickering headings |

Themes are toggled via buttons in the header and persist across sessions.

## 🧪 Mock Data

The app includes comprehensive mock data for demo purposes — no real API keys needed. Search any Indian city pair for instant results. Pre-loaded routes:
- Delhi → Mumbai
- Bangalore → Goa
- Chennai → Hyderabad
- Kolkata → Varanasi
- Mumbai → Pune
- Delhi → Jaipur

## 📞 Support

- **Email:** 24co35@aitdgoa.edu.in
- **Phone:** +91 7218694977
- **HQ:** TripSathi Tower, Mandrem, Pernem, North Goa, Goa

## License

This project is for educational purposes.

---

Built with ❤️ for Indian travelers by **Team Crimson Syndicate**.

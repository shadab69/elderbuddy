# Elder-O-Buddy — Architecture Overview

Elder-O-Buddy is a building-materials marketplace with a turnkey
home-construction enquiry flow: a public storefront (catalogue, cart,
Cash-on-Delivery checkout, builders/designers/guides), an admin console,
and email notifications for leads and orders.

## System shape

```
Browser (React SPA, hash router)
   │  axios calls to /api/*
   ▼
Express app  (backend/server.js)
   ├── /api/*        → backend/routes/* → controllers → Mongoose models
   ├── /uploads/*    → statically served uploaded images
   └── /*            → built SPA from dist/ (production)
   │
   ├── MongoDB (Mongoose) — primary data store, auto-seeded on first run
   ├── backend/data/*.json + data.js seed arrays — fallback read source
   └── SMTP (Nodemailer) — lead/order notification emails
```

## Frontend

- **React 18 + Vite** (`src/`), hash-based routing, pages loaded with
  `React.lazy` so each route ships as its own chunk.
- Global state (cart, catalogue, theme) lives in `AppContext`
  (`src/App.jsx`); catalogue data is fetched from the API and mirrored
  to `localStorage` so the storefront still renders if the API is
  unreachable.
- The seed catalogue bundled with the frontend comes from
  `backend/data/data.js` (`INITIAL_*` arrays, shared with the backend
  seeder).
- **Admin Console** (`src/pages/AdminConsole.jsx`) manages products,
  categories, units, banners, builders, designers, guides, leads,
  orders and email preferences. It stores the admin token in
  `localStorage` (`elder_admin_token`); an axios request interceptor
  (`src/utils/adminToken.js`, installed in `src/main.jsx`) attaches it
  as the `x-admin-token` header on API calls.

## Backend

- **Express 4** app in `backend/server.js`; all API routes are mounted
  under `/api` via `backend/routes/apiRoutes.js` and implemented as
  route → controller → Mongoose model (`backend/models/`).
- **Data layer:** MongoDB via Mongoose (`backend/config/database.js`),
  auto-seeded from the `INITIAL_*` arrays in `backend/data/data.js`
  when collections are empty.
- **JSON fallback:** when MongoDB is not connected
  (`mongoose.connection.readyState !== 1`), catalogue GET endpoints
  serve the seed data instead of failing — products / categories /
  banners / units from `backend/data/*.json`, builders / guides parsed
  from `data.js` (`backend/utils/jsonFallback.js`). Mongoose command
  buffering is disabled so a down database fails instantly rather than
  hanging. Writes always require the database.
- **Uploads:** `POST /api/upload` (Multer, images only, 10 MB limit)
  stores files in `backend/uploads/`, served back under `/uploads/`.

## Authentication model

There are no customer accounts. The only credential in the system is a
single shared **admin token**:

- Set via the `ADMIN_TOKEN` environment variable on the server.
- Required (as `x-admin-token` header or `Authorization: Bearer`) on
  every write endpoint and on the PII-bearing reads `GET /api/leads`
  and `GET /api/orders` — enforced by `backend/middleware/adminAuth.js`
  using a timing-safe comparison.
- Fails closed: with no `ADMIN_TOKEN` set, guarded endpoints return
  401 — except under `NODE_ENV=development`, where they pass with a
  console warning (local development only).
- Public by design: catalogue reads, lead creation and order placement
  need no token.
- CORS is restricted to the origins listed in `ALLOWED_ORIGINS`.

## Email flow

- Configuration comes **only from environment variables**
  (`SMTP_*`, legacy `EMAIL_*` aliases, `ADMIN_EMAIL`) — see
  `backend/services/emailService.js`. There is no config file and no
  way to change SMTP credentials through the API;
  `POST /api/email/config` can only adjust non-secret preferences
  (admin email, notify flags) in memory. `GET /api/email/config`
  always masks the password.
- New leads and orders trigger an admin notification email and a
  customer confirmation email (Nodemailer). If SMTP is not configured,
  the request is still logged and the API responds successfully.

## Deployment

- **Local:** `npm run server` (Express, port from `PORT`) +
  `npm run dev` (Vite, port 5173, proxies `/api` and `/uploads`), or
  `npm run dev:all` for both. `npm start` serves the built SPA + API
  from Express alone.
- **Vercel:** `api/index.js` re-exports the Express app as a serverless
  function; `vercel.json` rewrites `/api/(.*)` to it. Production
  environment variables are set in the Vercel project settings.
- **CI:** GitHub Actions (`.github/workflows/ci.yml`) runs
  `npm install` + `npm run build` on pushes to `main` and on PRs.

## Payments

Checkout is **Cash on Delivery by design** (standard for site-delivered
building materials). Online payments are a roadmap item, not part of
the current scope.

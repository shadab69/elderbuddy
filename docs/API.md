# Elder-O-Buddy — API Reference

All endpoints are mounted under `/api` (see `backend/routes/apiRoutes.js`).

**Auth legend**
- **Public** — no token needed.
- **Admin** — requires the server-side `ADMIN_TOKEN`, sent as the
  `x-admin-token` header or `Authorization: Bearer <token>`
  (`backend/middleware/adminAuth.js`). Missing/wrong token → `401`.

## Products

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/products` | Public | List all products |
| POST | `/api/products` | Admin | Create a product |
| GET | `/api/products/:id` | Public | Get one product |
| PUT | `/api/products/:id` | Admin | Update a product |
| DELETE | `/api/products/:id` | Admin | Delete a product |

## Categories

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/categories` | Public | List all categories (with subcategories) |
| POST | `/api/categories` | Admin | Create a category |
| PUT | `/api/categories/:id` | Admin | Update a category |
| DELETE | `/api/categories/:id` | Admin | Delete a category |

## Units (measurement units)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/units` | Public | List all units |
| POST | `/api/units` | Admin | Create a unit |
| DELETE | `/api/units/:id` | Admin | Delete a unit |

## Banners

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/banners` | Public | List homepage banners |
| POST | `/api/banners` | Admin | Create a banner |
| GET | `/api/banners/:id` | Public | Get one banner |
| PUT | `/api/banners/:id` | Admin | Update a banner |
| DELETE | `/api/banners/:id` | Admin | Delete a banner |

## Buying guides (blog)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/guides` | Public | List buying guides |
| POST | `/api/guides` | Admin | Create a guide |
| GET | `/api/guides/:id` | Public | Get one guide |
| PUT | `/api/guides/:id` | Admin | Update a guide |
| DELETE | `/api/guides/:id` | Admin | Delete a guide |

## Interior designers

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/designers` | Public | List designer profiles/portfolios |
| POST | `/api/designers` | Admin | Create a designer |
| GET | `/api/designers/:id` | Public | Get one designer |
| PUT | `/api/designers/:id` | Admin | Update a designer |
| DELETE | `/api/designers/:id` | Admin | Delete a designer |

## Builders

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/builders` | Public | List builder profiles/portfolios |
| POST | `/api/builders` | Admin | Create a builder |
| GET | `/api/builders/:id` | Public | Get one builder |
| PUT | `/api/builders/:id` | Admin | Update a builder |
| DELETE | `/api/builders/:id` | Admin | Delete a builder |

## Leads (enquiries)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/leads` | Admin | List leads (contains customer PII, hence guarded) |
| POST | `/api/leads` | Public | Submit an enquiry / consultation request |

## Orders

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/orders` | Admin | List orders (contains customer PII, hence guarded) |
| POST | `/api/orders` | Public | Place a Cash-on-Delivery order |

## Uploads

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/upload` | Admin | Upload one image (multipart form field `image`, images only, max 10 MB); stored under `backend/uploads/` and served from `/uploads/` |

## Email configuration

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/email/config` | Public | Read email configuration — the SMTP password is always masked (`********`) and `isConfigured` reports whether credentials are set |
| POST | `/api/email/config` | Admin | Update non-secret preferences only (admin email, notify flags). SMTP credentials are environment-managed and cannot be changed here |
| POST | `/api/email/test` | Admin | Send a test email |

## Notes

- Catalogue GET endpoints (`products`, `categories`, `units`, `banners`,
  `guides`, `builders`) fall back to the seed data in `backend/data/`
  when MongoDB is disconnected, so they keep responding on a fresh
  clone without a database. All writes require MongoDB.
- Request/response bodies are JSON (except the multipart upload).

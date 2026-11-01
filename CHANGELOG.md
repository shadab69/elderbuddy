# Changelog

A human-readable history of Elder-O-Buddy, summarised by month from the
project's git history. For the exact commit list, run `git log`.

## November 2026 — Audit, hardening and test foundation

**Security & reliability audit fixes**
- Moved all SMTP configuration to environment variables; removed the tracked
  `.env` and `backend/config/emailConfig.json` from the repository.
- Added an admin-token guard (`x-admin-token`) to every write endpoint and
  to the leads/orders reads; restricted CORS to an allow-list.
- Added a JSON seed fallback so the catalogue APIs keep working when
  MongoDB is unavailable, and an Admin Console token entry so the console
  works against the guarded API.
- Removed tracked runtime uploads and scratch scripts; added GitHub
  Actions CI (install + build on every push).

**Data integrity**
- Completed the measurement-unit reference lists in both seed sources and
  corrected mislabelled units.
- Synced the JSON fallback catalogue with the canonical seed
  (71 products, 13 categories) via `scripts/sync-seed-json.js`, removing
  discontinued products that only existed in the fallback.

**Tests & docs (first test suite in the project)**
- `node:test` suites for seed data integrity, the admin-token guard,
  email-config credential safety, and a seed-drift guard.
- Architecture overview, a table of all API endpoints, a contributing
  guide, and README corrections (run instructions, legal pages, LICENSE).

**Backend hardening (later in November)**
- Request validation for lead and order payloads (Indian mobile numbers,
  optional email, item/quantity rules) with HTTP 400 responses.
- Central JSON error handler and a JSON 404 for unknown `/api/*` routes.
- `GET /api/health` reporting live database mode (`connected`/`fallback`).
- In-memory rate limiting on the public lead/order creation endpoints.
- Fixed a checkout price corruption bug: an unsafe `_id` comparison priced
  every cart line as the first catalogue product at checkout; cart and
  order totals are now covered by regression tests.

## August 2026 — Email automation, catalogue completion, rebrand

- Automated email system: admin alerts and customer confirmations with
  itemised invoices for both inquiries and orders, hardened for the
  serverless (Vercel) environment.
- Catalogue completed: every subcategory populated with real product
  images and specifications; products mapped to exact subcategories;
  four new top-level categories (Digital Lockers & Safes, PVC Panels,
  Wooden Flooring, Designer Wallpapers).
- "Build Your Home" turnkey page with a 108-point quality-check modal,
  connected to the email dispatch flow.
- Mobile experience: navigation drawer, bottom bar, subcategory grids,
  filter drawer; an in-site AI shopping copilot; Schema.org JSON-LD.
- Instant optimistic rendering from a localStorage cache.
- Full rebrand from BuilderPro to **Elder-O-Buddy**.

## June 2026 — React migration and storefront growth

- Migrated the marketplace frontend to React 18 + Vite and reorganised
  the project layout; deployment configuration for Vercel.
- Local mock-data fallbacks so the storefront renders without a backend.
- Buying Guides section, infinite brands marquee, auto-scrolling product
  rows, Designer CRUD in the Admin Console backed by MongoDB schemas.
- Extensive mobile responsiveness work across navigation, grids and the
  admin sidebar.

## May 2026 — Project start

- Initial commit: building-materials marketplace ("BuilderPro") with a
  light catalogue theme, custom sliders and real product imagery.
- Admin panel, categories, banners and the first Express + MongoDB
  backend with seed data.
- Early mobile layout fixes (stacked header, scrollable navigation).

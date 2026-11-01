# Testing

Elder-O-Buddy's backend test suite uses Node's built-in test runner
(`node:test`) — no extra dependencies, no transpilation.

## Running the suite

```bash
npm test            # runs every file in tests/*.test.js
node --test tests/validate.test.js   # a single file
```

The suite needs no database and no `.env`: validators, middleware and the
seed data are exercised in isolation, and the one integration test mounts
the API router without connecting to MongoDB.

## What each file covers

| File | Covers |
| --- | --- |
| `tests/data-integrity.test.js` | The seed catalogue itself, in BOTH sources (JSON snapshot and `data.js` `INITIAL_*`): every product has id/name/price/category, category and subcategory references resolve, no duplicate ids, every referenced unit exists. |
| `tests/seed-sync.test.js` | **Drift guard:** the JSON fallback snapshot (`backend/data/*.json`) must match the canonical seed in `backend/data/data.js` exactly — same product/category/unit/banner id sets, field for field. If this fails after a catalogue edit, run `node scripts/sync-seed-json.js`. |
| `tests/admin-auth.test.js` | The admin-token guard: with `ADMIN_TOKEN` set, missing/wrong tokens get 401 and correct tokens pass via `x-admin-token` or `Bearer`; unset in production it fails closed (401), in development it passes with a warning. |
| `tests/email-config.test.js` | Email configuration safety: config is read from environment variables (incl. legacy aliases), the API response never exposes a raw SMTP password, and `saveEmailConfig()` can never overwrite SMTP credentials. |
| `tests/validate.test.js` | Lead/order payload validation (`backend/utils/validate.js`): Indian mobile normalisation (`+91`/spaces/`0` prefixes), optional-but-valid email, message length caps, order item rules (product reference + quantity > 0). Fixtures mirror the real InquiryModal, BuildYourHome and Checkout payload shapes. |
| `tests/product-lookup.test.js` | Regression suite for the cart → checkout price corruption bug: resolving cart items against the real 71-product seed catalogue must return each item's own product and price (never the first catalogue entry), for both `_id`-less seed products and MongoDB-shaped products. |
| `tests/error-handler.test.js` | The JSON 404 for unknown `/api/*` routes and the central error handler: 4xx errors keep their message, 5xx errors return a generic message without leaking internals. |
| `tests/health.test.js` | `GET /api/health` over real HTTP against the mounted API router: 200, `status: "ok"`, `db: "fallback"` when MongoDB is disconnected, valid ISO timestamp. |
| `tests/rate-limit.test.js` | The in-memory rate limiter with an injected clock: requests pass up to the limit, then 429 with `Retry-After`; the allowance resets after the window; limits are per-IP. |

## Conventions for new tests

- One file per unit/area, named `tests/<area>.test.js`; the `npm test`
  glob picks it up automatically.
- Prefer deterministic tests: inject clocks/config instead of sleeping or
  depending on wall time, network, or a running database.
- When a bug is fixed, add the regression test that failed before the fix
  in the same work (see `tests/product-lookup.test.js` for the pattern).
- Frontend-shared helpers in `src/utils/` are plain ES modules and can be
  required from tests directly (Node ≥ 20 handles this for side-effect-free
  modules like `productLookup.js`).

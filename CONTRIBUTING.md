# Contributing to Elder-O-Buddy

## Prerequisites

- Node.js 18+ (CI uses Node 20)
- MongoDB running locally for full write functionality
  (`mongodb://127.0.0.1:27017/builderpro` by default). Without it the
  server still starts and catalogue reads are served from the seed
  data in `backend/data/` — only writes need the database.

## Setup

```bash
npm install
cp .env.example .env   # then fill in real values; .env is gitignored — never commit it
```

Key environment variables (full list in `.env.example` and the README):
`PORT`, `MONGODB_URI`, `ADMIN_TOKEN` (required for admin/write API
calls outside development), `ALLOWED_ORIGINS`, and the `SMTP_*`
variables for email notifications.

## Running

```bash
npm run dev:all   # Express backend + Vite dev server together
npm run dev       # frontend only (Vite, http://localhost:5173)
npm run server    # backend only (Express)
npm run build     # production build into dist/
npm start         # serve the built SPA + API from Express
```

## Tests

```bash
npm test
```

The suite in `tests/` uses Node's built-in test runner — no extra
dependencies. It covers seed-catalogue data integrity, the admin-token
guard, and email-config safety. Please run it (and `npm run build`)
before pushing; if you change seed data in `backend/data/`, update the
expected counts in `tests/data-integrity.test.js` in the same commit.

## Commit conventions

- One logical change per commit, with a short imperative subject,
  e.g. `fix(api): …`, `feat(admin): …`, `test: …`, `docs: …`,
  `chore: …`.
- Keep commits honest: the message must describe exactly what the
  commit changes.

## House rules

- **Never commit secrets.** No `.env`, no SMTP credentials, no config
  files with passwords — configuration comes from environment
  variables only.
- **Never commit runtime files** — `backend/uploads/` contents and
  `scratch/` are gitignored on purpose.
- New write/admin endpoints must use the `adminAuth` middleware
  (`backend/middleware/adminAuth.js`); reads that expose customer PII
  (leads, orders) must use it too.
- If you add or rename an API endpoint, update `docs/API.md` in the
  same change.

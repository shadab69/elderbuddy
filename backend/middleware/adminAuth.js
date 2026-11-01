const crypto = require('crypto');

// ---------------------------------------------------------------------------
// Admin guard for write/admin API endpoints.
//
// The caller must send the shared secret from the ADMIN_TOKEN environment
// variable, either as an `x-admin-token` header or as
// `Authorization: Bearer <token>`.
//
// Behaviour when ADMIN_TOKEN is NOT set:
//   - NODE_ENV=development -> request is allowed, with a one-time console
//     warning (local development convenience only).
//   - anything else (production) -> request is rejected with 401.
// ---------------------------------------------------------------------------
let warned = false;

function adminAuth(req, res, next) {
  const expected = process.env.ADMIN_TOKEN;

  if (!expected) {
    if (process.env.NODE_ENV === 'development') {
      if (!warned) {
        warned = true;
        console.warn('[AdminAuth] WARNING: ADMIN_TOKEN is not set. Admin/write endpoints are OPEN because NODE_ENV=development. Never run production this way.');
      }
      return next();
    }
    return res.status(401).json({
      message: 'Unauthorized: admin token is not configured on the server (set ADMIN_TOKEN).'
    });
  }

  const headerToken = req.get('x-admin-token') || '';
  const authHeader = req.get('authorization') || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const provided = headerToken || bearerToken;

  const ok =
    provided.length > 0 &&
    provided.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected));

  if (!ok) {
    return res.status(401).json({
      message: 'Unauthorized: a valid admin token is required (x-admin-token header).'
    });
  }
  return next();
}

module.exports = adminAuth;

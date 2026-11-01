// ---------------------------------------------------------------------------
// Minimal in-memory rate limiter for the public POST endpoints.
//
// No external dependency and no shared store: counts are kept per process,
// which is the right trade-off for this app's scale (single-instance /
// serverless containers). It blunts form-spam and scripted abuse of the
// lead and order endpoints; it is not a substitute for edge/WAF limiting.
//
// The clock is injectable (options.now) so tests are deterministic.
// ---------------------------------------------------------------------------

const DEFAULT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const DEFAULT_MAX = 30; // requests per window per IP

function createRateLimiter(options = {}) {
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const max = options.max ?? DEFAULT_MAX;
  const now = options.now ?? (() => Date.now());
  const keyGenerator =
    options.keyGenerator ?? ((req) => req.ip || (req.socket && req.socket.remoteAddress) || 'unknown');

  const hits = new Map(); // key -> { count, resetAt }

  function rateLimiter(req, res, next) {
    const key = keyGenerator(req);
    const t = now();

    let entry = hits.get(key);
    if (!entry || t >= entry.resetAt) {
      entry = { count: 0, resetAt: t + windowMs };
      hits.set(key, entry);
    }
    entry.count += 1;

    if (entry.count > max) {
      const retryAfterSec = Math.max(1, Math.ceil((entry.resetAt - t) / 1000));
      if (typeof res.set === 'function') res.set('Retry-After', String(retryAfterSec));
      return res.status(429).json({
        message: 'Too many requests. Please wait a few minutes and try again.'
      });
    }

    // Opportunistic cleanup so the map cannot grow without bound.
    if (hits.size > 1000) {
      for (const [k, v] of hits) {
        if (t >= v.resetAt) hits.delete(k);
      }
    }
    return next();
  }

  // Test/maintenance helper: forget all recorded hits.
  rateLimiter.reset = () => hits.clear();

  return rateLimiter;
}

// Shared limiter for the public lead/order creation endpoints:
// 30 submissions per 10 minutes per IP is far above any human's usage.
const publicPostRateLimiter = createRateLimiter({
  windowMs: DEFAULT_WINDOW_MS,
  max: DEFAULT_MAX
});

module.exports = { createRateLimiter, publicPostRateLimiter };

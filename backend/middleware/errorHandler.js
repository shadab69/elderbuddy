// ---------------------------------------------------------------------------
// Central error handling + JSON 404 for the API.
//
// apiNotFound is mounted on /api AFTER the real routers: any /api/* request
// that reaches it matched nothing, so it answers a JSON 404 instead of
// falling through to the SPA HTML fallback (which API clients cannot use).
//
// errorHandler is the last middleware in the app: errors passed to next(err)
// by any route or middleware (including body-parser JSON failures and CORS
// rejections) are answered as JSON. Client errors (4xx) keep their message;
// server errors (5xx) return a generic message and are logged in full.
// ---------------------------------------------------------------------------

function apiNotFound(req, res) {
  res.status(404).json({
    message: `API route not found: ${req.method} ${req.originalUrl || req.url}`
  });
}

// eslint-disable-next-line no-unused-vars -- Express requires the 4-arg shape
function errorHandler(err, req, res, next) {
  if (res.headersSent) return;
  const status =
    Number.isInteger(err && err.status)
      ? err.status
      : Number.isInteger(err && err.statusCode)
        ? err.statusCode
        : 500;

  if (status >= 500) {
    console.error('[errorHandler]', err && err.stack ? err.stack : err);
    return res.status(status).json({ message: 'Internal server error' });
  }
  return res.status(status).json({ message: err.message || 'Request failed' });
}

module.exports = { apiNotFound, errorHandler };

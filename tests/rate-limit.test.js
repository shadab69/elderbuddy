// Deterministic unit tests for the in-memory rate limiter
// (backend/middleware/rateLimit.js). The clock is injected, so window
// expiry is tested exactly — no sleeps, no timing flakiness.

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const { createRateLimiter } = require('../backend/middleware/rateLimit');

function mockReq(ip) {
  return { ip, socket: { remoteAddress: ip } };
}

function mockRes() {
  return {
    statusCode: null,
    body: null,
    headers: {},
    set(name, value) { this.headers[name] = value; return this; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; }
  };
}

function run(limiter, req) {
  const res = mockRes();
  let nextCalls = 0;
  limiter(req, res, () => { nextCalls++; });
  return { res, nextCalls };
}

describe('createRateLimiter', () => {
  it('allows requests up to the limit, then answers 429 with Retry-After', () => {
    let t = 1_000_000;
    const limiter = createRateLimiter({ windowMs: 60_000, max: 3, now: () => t });
    const req = mockReq('1.2.3.4');

    for (let i = 0; i < 3; i++) {
      const { res, nextCalls } = run(limiter, req);
      assert.equal(nextCalls, 1, `request ${i + 1} should pass`);
      assert.equal(res.statusCode, null);
    }

    const blocked = run(limiter, req);
    assert.equal(blocked.nextCalls, 0);
    assert.equal(blocked.res.statusCode, 429);
    assert.match(blocked.res.body.message, /Too many requests/);
    assert.equal(blocked.res.headers['Retry-After'], '60');
  });

  it('resets the allowance when the window expires', () => {
    let t = 0;
    const limiter = createRateLimiter({ windowMs: 10_000, max: 1, now: () => t });
    const req = mockReq('5.6.7.8');

    assert.equal(run(limiter, req).nextCalls, 1);
    assert.equal(run(limiter, req).res.statusCode, 429);

    t += 10_001; // past the window
    const after = run(limiter, req);
    assert.equal(after.nextCalls, 1);
    assert.equal(after.res.statusCode, null);
  });

  it('tracks different IPs independently', () => {
    let t = 0;
    const limiter = createRateLimiter({ windowMs: 60_000, max: 1, now: () => t });

    assert.equal(run(limiter, mockReq('10.0.0.1')).nextCalls, 1);
    assert.equal(run(limiter, mockReq('10.0.0.1')).res.statusCode, 429);
    // A second visitor is unaffected by the first one's limit.
    assert.equal(run(limiter, mockReq('10.0.0.2')).nextCalls, 1);
  });

  it('reset() clears all recorded hits', () => {
    let t = 0;
    const limiter = createRateLimiter({ windowMs: 60_000, max: 1, now: () => t });
    const req = mockReq('9.9.9.9');
    assert.equal(run(limiter, req).nextCalls, 1);
    assert.equal(run(limiter, req).res.statusCode, 429);
    limiter.reset();
    assert.equal(run(limiter, req).nextCalls, 1);
  });
});

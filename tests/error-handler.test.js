// Unit tests for the API 404 + central error handler
// (backend/middleware/errorHandler.js). The live wiring (unknown /api route
// returning JSON instead of the SPA page) is covered by the smoke checks;
// here the response shapes are pinned directly.

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const { apiNotFound, errorHandler } = require('../backend/middleware/errorHandler');

function mockRes() {
  return {
    headersSent: false,
    statusCode: null,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; }
  };
}

describe('apiNotFound', () => {
  it('answers 404 JSON naming the method and path', () => {
    const res = mockRes();
    apiNotFound({ method: 'GET', originalUrl: '/api/nope' }, res);
    assert.equal(res.statusCode, 404);
    assert.match(res.body.message, /GET \/api\/nope/);
  });

  it('works for non-GET methods too', () => {
    const res = mockRes();
    apiNotFound({ method: 'DELETE', originalUrl: '/api/products/xyz' }, res);
    assert.equal(res.statusCode, 404);
    assert.match(res.body.message, /DELETE/);
  });
});

describe('errorHandler', () => {
  it('passes through a 4xx status with its message', () => {
    const res = mockRes();
    const err = new Error('Origin http://evil.example is not allowed by CORS');
    err.status = 400;
    errorHandler(err, {}, res, () => {});
    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /not allowed by CORS/);
  });

  it('honours err.statusCode when err.status is absent (body-parser shape)', () => {
    const res = mockRes();
    const err = new SyntaxError('Unexpected token } in JSON');
    err.statusCode = 400;
    errorHandler(err, {}, res, () => {});
    assert.equal(res.statusCode, 400);
  });

  it('answers a generic 500 without leaking internals', () => {
    const res = mockRes();
    const err = new Error('connect ECONNREFUSED 10.0.0.5:27017 (internal detail)');
    errorHandler(err, {}, res, () => {});
    assert.equal(res.statusCode, 500);
    assert.equal(res.body.message, 'Internal server error');
    assert.ok(!JSON.stringify(res.body).includes('ECONNREFUSED'));
  });
});

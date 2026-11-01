// Behaviour tests for the admin-token guard (backend/middleware/adminAuth.js).
//
// The guard protects every write endpoint and the leads/orders reads.
// It accepts the ADMIN_TOKEN env var via the `x-admin-token` header or an
// `Authorization: Bearer <token>` header, and fails closed (401) in
// production when no token is configured.

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');

const adminAuth = require('../backend/middleware/adminAuth');

const TOKEN = 'test-admin-token-0123456789';

let savedEnv;

beforeEach(() => {
  savedEnv = { ADMIN_TOKEN: process.env.ADMIN_TOKEN, NODE_ENV: process.env.NODE_ENV };
});

afterEach(() => {
  if (savedEnv.ADMIN_TOKEN === undefined) delete process.env.ADMIN_TOKEN;
  else process.env.ADMIN_TOKEN = savedEnv.ADMIN_TOKEN;
  if (savedEnv.NODE_ENV === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = savedEnv.NODE_ENV;
});

function mockReq(headers = {}) {
  const lower = {};
  for (const [k, v] of Object.entries(headers)) lower[k.toLowerCase()] = v;
  return { get: (name) => lower[name.toLowerCase()] };
}

function mockRes() {
  return {
    statusCode: null,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; }
  };
}

function run(req) {
  const res = mockRes();
  let nextCalls = 0;
  adminAuth(req, res, () => { nextCalls++; });
  return { res, nextCalls };
}

describe('adminAuth with ADMIN_TOKEN configured', () => {
  beforeEach(() => { process.env.ADMIN_TOKEN = TOKEN; });

  it('rejects a request with no token (401, next not called)', () => {
    const { res, nextCalls } = run(mockReq());
    assert.equal(res.statusCode, 401);
    assert.equal(nextCalls, 0);
  });

  it('accepts the correct token via the x-admin-token header', () => {
    const { res, nextCalls } = run(mockReq({ 'x-admin-token': TOKEN }));
    assert.equal(nextCalls, 1);
    assert.equal(res.statusCode, null);
  });

  it('accepts the correct token via Authorization: Bearer', () => {
    const { nextCalls } = run(mockReq({ authorization: `Bearer ${TOKEN}` }));
    assert.equal(nextCalls, 1);
  });

  it('rejects a wrong token of the same length', () => {
    const { res, nextCalls } = run(mockReq({ 'x-admin-token': 'x'.repeat(TOKEN.length) }));
    assert.equal(res.statusCode, 401);
    assert.equal(nextCalls, 0);
  });

  it('rejects a token of a different length without throwing', () => {
    const { res, nextCalls } = run(mockReq({ 'x-admin-token': 'short' }));
    assert.equal(res.statusCode, 401);
    assert.equal(nextCalls, 0);
  });

  it('rejects a wrong Bearer token', () => {
    const { res, nextCalls } = run(mockReq({ authorization: 'Bearer not-the-token' }));
    assert.equal(res.statusCode, 401);
    assert.equal(nextCalls, 0);
  });
});

describe('adminAuth with ADMIN_TOKEN not configured', () => {
  beforeEach(() => { delete process.env.ADMIN_TOKEN; });

  it('fails closed with 401 outside development', () => {
    process.env.NODE_ENV = 'production';
    const { res, nextCalls } = run(mockReq());
    assert.equal(res.statusCode, 401);
    assert.equal(nextCalls, 0);
  });

  it('allows requests in development (documented local-dev behaviour)', () => {
    process.env.NODE_ENV = 'development';
    const { nextCalls } = run(mockReq());
    assert.equal(nextCalls, 1);
  });
});

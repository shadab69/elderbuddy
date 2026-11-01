// Integration test for GET /api/health: mounts the real API router in a
// throwaway Express app (no MongoDB connection is made — controllers only
// connect when server.js runs connectDB) and checks the response shape
// over real HTTP on an ephemeral port.

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const http = require('http');

const apiRoutes = require('../backend/routes/apiRoutes');

let server;
let baseUrl;

before(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api', apiRoutes);
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

function get(path) {
  return new Promise((resolve, reject) => {
    http
      .get(`${baseUrl}${path}`, (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(raw) }));
      })
      .on('error', reject);
  });
}

describe('GET /api/health', () => {
  it('answers 200 with status ok', async () => {
    const { status, body } = await get('/api/health');
    assert.equal(status, 200);
    assert.equal(body.status, 'ok');
  });

  it('reports db as "fallback" when MongoDB is not connected', async () => {
    const { body } = await get('/api/health');
    assert.equal(body.db, 'fallback');
  });

  it('includes a valid ISO timestamp', async () => {
    const { body } = await get('/api/health');
    assert.equal(typeof body.timestamp, 'string');
    assert.ok(!Number.isNaN(Date.parse(body.timestamp)), 'timestamp should parse as a date');
  });
});

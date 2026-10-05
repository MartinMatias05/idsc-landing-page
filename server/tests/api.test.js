'use strict';

/**
 * HTTP-level tests: start the real Express app on a random port and call every documented endpoint.
 * Requires `npm install` in server/ (express, cors, swagger-ui-express).
 */
const test = require('node:test');
const assert = require('node:assert/strict');

const { createApp, API_PREFIX } = require('../app');
const { spec, schemaValidator, responseSchemaName, operations } = require('./helpers');

let server;
let base;

test.before(async () => {
  server = createApp({ frontendUrl: 'http://localhost:5173' }).listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => server.close());

const get = (p, init) => fetch(`${base}${API_PREFIX}${p}`, init);

/** Fills `{id}` with the documented example so path templates become callable URLs. */
function concretePath(openapiPath, operation) {
  return openapiPath.replace(/\{(\w+)\}/g, (_, name) => {
    const param = (operation.parameters || [])
      .map((x) => (x.$ref ? spec.components.parameters[x.$ref.split('/').pop()] : x))
      .find((x) => x.name === name);
    return param.example;
  });
}

for (const [p, , op] of operations()) {
  test(`GET ${p} -> 200 and matches the contract`, async () => {
    const res = await get(concretePath(p, op));
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type'), /application\/json/);
    const { valid, errors } = schemaValidator(responseSchemaName(op))(await res.json());
    assert.ok(valid, errors.join('\n'));
  });
}

test('GET /health returns exactly { status: "ok" }', async () => {
  assert.deepEqual(await (await get('/health')).json(), { status: 'ok' });
});

test('GET /programs?level=college|shs filters', async () => {
  const college = await (await get('/programs?level=college')).json();
  const shs = await (await get('/programs?level=shs')).json();
  assert.equal(college.total, 9);
  assert.equal(shs.total, 2);
});

async function expectProblem(res, status) {
  assert.equal(res.status, status);
  assert.match(res.headers.get('content-type'), /application\/problem\+json/);
  const body = await res.json();
  const { valid, errors } = schemaValidator('ProblemDetails')(body);
  assert.ok(valid, errors.join('\n'));
  assert.equal(body.status, status);
  return body;
}

test('invalid level -> 400 Problem Details with field error', async () => {
  const body = await expectProblem(await get('/programs?level=graduate'), 400);
  assert.equal(body.errors[0].field, 'level');
  assert.equal(body.instance, '/api/v1/programs?level=graduate');
});

test('malformed id -> 400 Problem Details', async () => {
  await expectProblem(await get('/news/NOT_VALID'), 400);
});

test('unknown ids -> 404 Problem Details', async () => {
  await expectProblem(await get('/news/news-999'), 404);
  await expectProblem(await get('/programs/program-999'), 404);
});

test('unknown route under /api/v1 -> 404 Problem Details; writes are not routed', async () => {
  await expectProblem(await get('/does-not-exist'), 404);
  await expectProblem(await get('/site', { method: 'POST' }), 404);
});

test('CORS allows the Vite origin only', async () => {
  const ok = await get('/site', { headers: { Origin: 'http://localhost:5173' } });
  assert.equal(ok.headers.get('access-control-allow-origin'), 'http://localhost:5173');
  const other = await get('/site', { headers: { Origin: 'http://evil.example' } });
  assert.equal(other.headers.get('access-control-allow-origin'), null);
});

test('Swagger UI is served at /docs', async () => {
  const res = await fetch(`${base}/docs/`);
  assert.equal(res.status, 200);
  assert.match(await res.text(), /swagger-ui/i);
});

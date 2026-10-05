'use strict';

/**
 * Contract tests. They need no running server:
 *  1. openapi.yaml is structurally sound and every route in routes/index.js is documented (and vice versa);
 *  2. every service output and every documented example validates against its OpenAPI schema;
 *  3. error bodies match the Problem Details schema;
 *  4. guard rails: no database dependency, no placeholder text.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { spec, schemaValidator, responseSchemaName, operations } = require('./helpers');
const { toProblemBody, ProblemError } = require('../errors');
const site = require('../services/site.service');
const news = require('../services/news.service');
const home = require('../services/home.service');
const programs = require('../services/program.service');
const admission = require('../services/admission.service');
const institution = require('../services/institution.service');

// operationId -> function that produces the response body for the documented example input.
const handlers = {
  getHealth: () => site.getHealth(),
  getSite: () => site.getSite(),
  getNavigation: () => site.getNavigation(),
  listNews: () => news.listNews(),
  getNews: () => news.getNews('news-002'),
  getEnrollment: () => home.getEnrollment(),
  getPulse: () => home.getPulse(),
  getStatistics: () => home.getStatistics(),
  listPrograms: () => programs.listPrograms(),
  getProgram: () => programs.getProgram('program-001'),
  getAdmissionRequirements: () => admission.getRequirements(),
  getAdmissionProcess: () => admission.getProcess(),
  getAdmissionTuition: () => admission.getTuition(),
  getPaymentInstructions: () => admission.getPaymentInstructions(),
  getAbout: () => institution.getAbout(),
  listFacilities: () => institution.listFacilities(),
};

test('OpenAPI document is 3.x with required metadata', () => {
  assert.match(spec.openapi, /^3\./);
  assert.ok(spec.info.title && spec.info.version && spec.info.description);
  assert.ok(spec.servers.length > 0);
  const tagNames = spec.tags.map((t) => t.name);
  for (const [, , op] of operations()) {
    assert.ok(op.operationId, 'operationId missing');
    assert.ok(op.tags.every((t) => tagNames.includes(t)), `unknown tag on ${op.operationId}`);
    assert.ok(op.responses['200'], `${op.operationId} lacks a 200 response`);
    assert.ok(op.responses['500'], `${op.operationId} lacks a 500 response`);
  }
  const ids = operations().map(([, , op]) => op.operationId);
  assert.equal(new Set(ids).size, ids.length, 'operationIds must be unique');
});

test('only GET operations exist (read-only module, no auth)', () => {
  for (const [p, method] of operations()) assert.equal(method, 'get', `${method} ${p}`);
});

test('routes/index.js and openapi.yaml describe exactly the same endpoints', () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'routes', 'index.js'), 'utf8');
  const implemented = [...source.matchAll(/router\.get\(\s*'([^']+)'/g)]
    .map((m) => m[1].replace(/:(\w+)/g, '{$1}'))
    .sort();
  const documented = Object.keys(spec.paths).sort();
  assert.deepEqual(implemented, documented);
});

test('every operation with input documents 400 and (for path ids) 404', () => {
  for (const [p, , op] of operations()) {
    const params = op.parameters || [];
    if (params.length > 0) assert.ok(op.responses['400'], `${p} should document 400`);
    if (params.some((x) => x.in === 'path' || x.$ref?.includes('Id'))) {
      assert.ok(op.responses['404'], `${p} should document 404`);
    }
  }
});

test('a handler exists for every documented operationId', () => {
  const ids = operations().map(([, , op]) => op.operationId).sort();
  assert.deepEqual(Object.keys(handlers).sort(), ids);
});

for (const [p, , op] of operations()) {
  test(`service output for GET ${p} matches schema ${responseSchemaName(op)}`, () => {
    const body = handlers[op.operationId]();
    const { valid, errors } = schemaValidator(responseSchemaName(op))(body);
    assert.ok(valid, errors.join('\n'));
  });
}

test('documented examples validate against their schemas', () => {
  for (const [p, , op] of operations()) {
    const entry = op.responses['200'].content['application/json'].examples.default;
    const example = entry.$ref ? spec.components.examples[entry.$ref.split('/').pop()].value : entry.value;
    const { valid, errors } = schemaValidator(responseSchemaName(op))(example);
    assert.ok(valid, `${p}: ${errors.join('; ')}`);
  }
});

test('Problem Details examples and generated bodies match ProblemDetails', () => {
  const check = schemaValidator('ProblemDetails');
  for (const response of Object.values(spec.components.responses)) {
    for (const example of Object.values(response.content['application/problem+json'].examples)) {
      const { valid, errors } = check(example.value);
      assert.ok(valid, errors.join('; '));
    }
  }
  assert.ok(check(toProblemBody(404, 'x', '/api/v1/x')).valid);
  assert.ok(check(toProblemBody(400, 'x', '/api/v1/x', [{ field: 'level', message: 'bad' }])).valid);
});

test('unknown ids throw 404 and malformed input throws 400 ProblemErrors', () => {
  assert.throws(() => news.getNews('news-999'), (e) => e instanceof ProblemError && e.status === 404);
  assert.throws(() => programs.getProgram('program-999'), (e) => e.status === 404);
  assert.throws(() => news.getNews('NEWS_1!'), (e) => e.status === 400 && e.errors[0].field === 'id');
  assert.throws(() => programs.getProgram('../etc'), (e) => e.status === 400);
  assert.throws(() => programs.listPrograms('graduate'), (e) => e.status === 400 && e.errors[0].field === 'level');
  assert.throws(() => programs.listPrograms(['college', 'shs']), (e) => e.status === 400);
});

test('programs filter by level', () => {
  assert.equal(programs.listPrograms('college').total, 9);
  assert.equal(programs.listPrograms('shs').total, 2);
  assert.equal(programs.listPrograms().total, 11);
  assert.ok(programs.listPrograms('shs').items.every((p) => p.level === 'shs'));
});

test('business rules: one featured news item, newest first, tuition ids resolve', () => {
  const list = news.listNews();
  assert.equal(list.items.filter((n) => n.featured).length, 1);
  const dates = list.items.map((n) => n.publishedOn);
  assert.deepEqual(dates, [...dates].sort().reverse());
  assert.ok(list.items.every((n) => !('body' in n)), 'list view must omit body');
  const tuition = admission.getTuition();
  assert.equal(tuition.groups[0].rows.length, 10);
  assert.equal(tuition.groups[1].rows.length, 2);
  for (const row of tuition.groups.flatMap((g) => g.rows)) {
    if (row.programId) assert.doesNotThrow(() => programs.getProgram(row.programId));
  }
});

test('statistics typo from Figma is corrected and values are flagged as mock', () => {
  const { items } = home.getStatistics();
  assert.ok(items.some((s) => s.label === 'Full-time Faculty'));
  assert.ok(!JSON.stringify(items).toUpperCase().includes('FACULTU'));
  assert.ok(items.every((s) => s.provider.isMock === true));
});

test('services return copies, so callers cannot mutate mock data', () => {
  const a = site.getSite();
  a.name = 'changed';
  assert.notEqual(site.getSite().name, 'changed');
});

test('no database or auth dependency is declared', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
  const banned = /mongo|mongoose|mysql|pg$|postgres|prisma|sequelize|firebase|supabase|sqlite|knex|jsonwebtoken|passport|bcrypt/i;
  assert.deepEqual(deps.filter((d) => banned.test(d)), []);
});

test('mock data and contract contain no placeholder text', () => {
  const dir = path.join(__dirname, '..');
  const files = [...fs.readdirSync(path.join(dir, 'data')).map((f) => path.join(dir, 'data', f)), path.join(dir, 'openapi.yaml')];
  const banned = /lorem ipsum|\bTODO\b|\bTBD\b|coming soon|PULSE INPUT|\[placeholder\]/i;
  for (const file of files) {
    assert.ok(!banned.test(fs.readFileSync(file, 'utf8')), `placeholder text in ${file}`);
  }
});

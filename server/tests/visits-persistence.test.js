'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const modulePath = path.resolve(__dirname, '../services/visit.service.js');

function run(script, filename) {
  return execFileSync(process.execPath, ['-e', script], {
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, VISITS_STORE_PATH: filename }, encoding: 'utf8',
  }).trim();
}

test('visitor count survives server process restarts', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'idsc-visitor-test-'));
  const filename = path.join(dir, 'visits.json');
  try {
    assert.equal(run(`const v = require(${JSON.stringify(modulePath)}); process.stdout.write(String(v.getVisitCount()))`, filename), '0');
    assert.equal(run(`const v = require(${JSON.stringify(modulePath)}); v.recordVisit(); v.recordVisit(); process.stdout.write(String(v.getVisitCount()))`, filename), '2');
    assert.equal(run(`const v = require(${JSON.stringify(modulePath)}); process.stdout.write(String(v.getVisitCount()))`, filename), '2');
    assert.deepEqual(JSON.parse(fs.readFileSync(filename, 'utf8')), { version: 1, count: 2 });
    assert.equal(run(`const v = require(${JSON.stringify(modulePath)}); process.stdout.write(String(v.recordVisit().count))`, filename), '3');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('corrupt visitor data fails closed rather than resetting counter', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'idsc-visitor-test-'));
  const filename = path.join(dir, 'visits.json');
  try {
    fs.writeFileSync(filename, '{invalid');
    assert.throws(() => run(`require(${JSON.stringify(modulePath)}).recordVisit()`, filename));
    assert.equal(fs.readFileSync(filename, 'utf8'), '{invalid');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

'use strict';

/**
 * Durable page-view counter. Intentionally independent from external systems.
 * Writes are serialized in the Node process and persisted before responding 201.
 * For production multi-instance deployments replace this file store with a
 * shared transactional database (e.g. PostgreSQL); do not share a local disk.
 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');

const DEFAULT_PATH = path.join(__dirname, '..', 'storage', 'visits.json');
let activePath;
let count;

function filePath() {
  return path.resolve(process.env.VISITS_STORE_PATH || DEFAULT_PATH);
}

function readCount(filename) {
  let raw;
  try { raw = fs.readFileSync(filename, 'utf8'); }
  catch (error) {
    if (error.code === 'ENOENT') return 0;
    throw error;
  }
  let parsed;
  try { parsed = JSON.parse(raw); }
  catch { throw new Error(`Visitor store is invalid JSON: ${filename}`); }
  if (!parsed || parsed.version !== 1 || !Number.isSafeInteger(parsed.count) || parsed.count < 0) {
    throw new Error(`Visitor store has invalid data: ${filename}`);
  }
  return parsed.count;
}

function ensureLoaded() {
  const filename = filePath();
  if (activePath !== filename) {
    count = readCount(filename);
    activePath = filename;
  }
  return count;
}

function persist(nextCount) {
  const filename = filePath();
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  const tmp = `${filename}.${process.pid}.${crypto.randomBytes(8).toString('hex')}.tmp`;
  try {
    const data = JSON.stringify({ version: 1, count: nextCount }) + '\n';
    fs.writeFileSync(tmp, data, { encoding: 'utf8', flag: 'wx', mode: 0o600 });
    fs.renameSync(tmp, filename);
  } finally {
    try { fs.unlinkSync(tmp); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
}

function recordVisit() {
  const previous = ensureLoaded();
  if (previous >= Number.MAX_SAFE_INTEGER) throw new Error('Visitor counter limit reached');
  const next = previous + 1;
  persist(next); // Never return success if the write fails.
  count = next;
  return { count };
}

function getVisitCount() { return ensureLoaded(); }

module.exports = { recordVisit, getVisitCount };

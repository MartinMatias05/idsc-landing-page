
'use strict';

// Cache external results to avoid excessive API requests.
const cache = new Map();

function getSetting(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

async function fetchExternalCount(envName) {
  const url = process.env[envName]?.trim();

  // No external system configured yet.
  if (!url) return 0;

  const cacheMs = getSetting('STATS_CACHE_MS', 60000);
  const timeoutMs = getSetting('STATS_TIMEOUT_MS', 3000);

  const cached = cache.get(envName);

  if (
    cached &&
    cached.url === url &&
    Date.now() < cached.expiresAt
  ) {
    return cached.value;
  }

  let count = 0;

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (response.ok) {
      const data = await response.json();

      // Provisional external API response: { "count": 123 }
      if (Number.isSafeInteger(data?.count) && data.count >= 0) {
        count = data.count;
      }
    }
  } catch {
    // Offline, timeout or invalid URL: safely display 0.
  }

  cache.set(envName, {
    url,
    value: count,
    expiresAt: Date.now() + cacheMs,
  });

  return count;
}

async function getExternalCounts() {
  const [studentsEnrolled, fullTimeFaculty] = await Promise.all([
    fetchExternalCount('REGISTRAR_STATS_URL'),
    fetchExternalCount('FACULTY_STATS_URL'),
  ]);

  return { studentsEnrolled, fullTimeFaculty };
}

module.exports = { getExternalCounts };

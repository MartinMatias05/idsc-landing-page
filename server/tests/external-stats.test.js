
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { getExternalCounts } = require('../services/external-stats.service');

test('unconfigured external systems return zero', async () => {
  const previousRegistrar = process.env.REGISTRAR_STATS_URL;
  const previousFaculty = process.env.FACULTY_STATS_URL;

  try {
    delete process.env.REGISTRAR_STATS_URL;
    delete process.env.FACULTY_STATS_URL;

    const result = await getExternalCounts();

    assert.deepEqual(result, {
      studentsEnrolled: 0,
      fullTimeFaculty: 0,
    });
  } finally {
    if (previousRegistrar === undefined) {
      delete process.env.REGISTRAR_STATS_URL;
    } else {
      process.env.REGISTRAR_STATS_URL = previousRegistrar;
    }

    if (previousFaculty === undefined) {
      delete process.env.FACULTY_STATS_URL;
    } else {
      process.env.FACULTY_STATS_URL = previousFaculty;
    }
  }
});



test('external CMS APIs provide student and faculty counts', async () => {
  const originalRegistrar = process.env.REGISTRAR_STATS_URL;
  const originalFaculty = process.env.FACULTY_STATS_URL;
  const originalFetch = global.fetch;

  try {
    process.env.REGISTRAR_STATS_URL =
      'https://registrar.example.test/statistics';
    process.env.FACULTY_STATS_URL =
      'https://faculty.example.test/statistics';

    global.fetch = async (url) => {
      if (url.includes('registrar')) {
        return {
          ok: true,
          json: async () => ({ count: 2120 }),
        };
      }

      return {
        ok: true,
        json: async () => ({ count: 34 }),
      };
    };

    const result = await getExternalCounts();

    assert.deepEqual(result, {
      studentsEnrolled: 2120,
      fullTimeFaculty: 34,
    });
  } finally {
    global.fetch = originalFetch;

    if (originalRegistrar === undefined) {
      delete process.env.REGISTRAR_STATS_URL;
    } else {
      process.env.REGISTRAR_STATS_URL = originalRegistrar;
    }

    if (originalFaculty === undefined) {
      delete process.env.FACULTY_STATS_URL;
    } else {
      process.env.FACULTY_STATS_URL = originalFaculty;
    }
  }
});



test('unavailable and invalid external APIs return zero', async () => {
  const originalRegistrar = process.env.REGISTRAR_STATS_URL;
  const originalFaculty = process.env.FACULTY_STATS_URL;
  const originalFetch = global.fetch;

  try {
    // Unique URLs prevent results from previous tests being cached.
    process.env.REGISTRAR_STATS_URL =
      'https://offline.example.test/statistics';
    process.env.FACULTY_STATS_URL =
      'https://invalid.example.test/statistics';

    global.fetch = async (url) => {
      if (url.includes('offline')) {
        throw new Error('External CMS unavailable');
      }

      return {
        ok: true,
        json: async () => ({ count: -50 }),
      };
    };

    const result = await getExternalCounts();

    assert.deepEqual(result, {
      studentsEnrolled: 0,
      fullTimeFaculty: 0,
    });
  } finally {
    global.fetch = originalFetch;

    if (originalRegistrar === undefined) {
      delete process.env.REGISTRAR_STATS_URL;
    } else {
      process.env.REGISTRAR_STATS_URL = originalRegistrar;
    }

    if (originalFaculty === undefined) {
      delete process.env.FACULTY_STATS_URL;
    } else {
      process.env.FACULTY_STATS_URL = originalFaculty;
    }
  }
});



test('external statistics use cached values', async () => {
  const originalRegistrar = process.env.REGISTRAR_STATS_URL;
  const originalFaculty = process.env.FACULTY_STATS_URL;
  const originalCache = process.env.STATS_CACHE_MS;
  const originalFetch = global.fetch;

  try {
    process.env.REGISTRAR_STATS_URL =
      'https://cache-registrar.example.test/count';
    process.env.FACULTY_STATS_URL =
      'https://cache-faculty.example.test/count';
    process.env.STATS_CACHE_MS = '60000';

    let requests = 0;

    global.fetch = async (url) => {
      requests++;

      return {
        ok: true,
        json: async () => ({
          count: url.includes('registrar') ? 500 : 25,
        }),
      };
    };

    const first = await getExternalCounts();
    const second = await getExternalCounts();

    assert.deepEqual(first, {
      studentsEnrolled: 500,
      fullTimeFaculty: 25,
    });

    assert.deepEqual(second, first);

    // One request per external CMS, not per statistics read.
    assert.equal(requests, 2);
  } finally {
    global.fetch = originalFetch;

    for (const [key, value] of [
      ['REGISTRAR_STATS_URL', originalRegistrar],
      ['FACULTY_STATS_URL', originalFaculty],
      ['STATS_CACHE_MS', originalCache],
    ]) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
});



test('external API timeout safely returns zero', async () => {
  const originalUrl = process.env.REGISTRAR_STATS_URL;
  const originalFaculty = process.env.FACULTY_STATS_URL;
  const originalTimeout = process.env.STATS_TIMEOUT_MS;
  const originalFetch = global.fetch;

  try {
    process.env.REGISTRAR_STATS_URL =
      'https://timeout-registrar.example.test/count';

    delete process.env.FACULTY_STATS_URL;
    process.env.STATS_TIMEOUT_MS = '30';

    global.fetch = (url, options) =>
      new Promise((resolve, reject) => {
        const signal = options.signal;

        if (signal.aborted) {
          reject(signal.reason);
          return;
        }

        signal.addEventListener(
          'abort',
          () => reject(signal.reason),
          { once: true }
        );
      });

    const result = await getExternalCounts();

    assert.deepEqual(result, {
      studentsEnrolled: 0,
      fullTimeFaculty: 0,
    });
  } finally {
    global.fetch = originalFetch;

    for (const [key, value] of [
      ['REGISTRAR_STATS_URL', originalUrl],
      ['FACULTY_STATS_URL', originalFaculty],
      ['STATS_TIMEOUT_MS', originalTimeout],
    ]) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
});

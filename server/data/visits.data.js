'use strict';

/**
 * Mock data: the Landing Page's own visitor (page-view) counter.
 * Lives in memory only, so it resets when the server restarts (no database in this version).
 * The starting value matches the design sample so the demo looks like the Figma statistics.
 */
const visits = { count: 20000 };

module.exports = { visits };

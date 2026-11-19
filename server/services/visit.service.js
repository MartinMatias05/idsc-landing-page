'use strict';

const { visits } = require('../data/visits.data');

/** Counts one view of the Landing Page and returns the new total. */
function recordVisit() {
  visits.count += 1;
  return { count: visits.count };
}

const getVisitCount = () => visits.count;

module.exports = { recordVisit, getVisitCount };

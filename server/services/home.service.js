'use strict';

const { enrollment, pulse, statistics } = require('../data/home.data');
const { getVisitCount } = require('./visit.service');

const getEnrollment = () => structuredClone(enrollment);
const getPulse = () => structuredClone({ ...pulse, total: pulse.items.length });

/** The Site Visitor value is the Landing Page's own live counter; the other two are mock values. */
function getStatistics() {
  const result = structuredClone(statistics);
  const visitors = result.items.find((item) => item.id === 'site-visitors');
  if (visitors) visitors.value = getVisitCount();
  return result;
}


module.exports = { getEnrollment, getPulse, getStatistics };

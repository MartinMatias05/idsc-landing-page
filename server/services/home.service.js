'use strict';

const { enrollment, pulse, statistics } = require('../data/home.data');

const getEnrollment = () => structuredClone(enrollment);
const getPulse = () => structuredClone({ ...pulse, total: pulse.items.length });
const getStatistics = () => structuredClone(statistics);

module.exports = { getEnrollment, getPulse, getStatistics };

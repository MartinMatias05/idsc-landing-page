'use strict';

const { site, navigation } = require('../data/site.data');

const getHealth = () => ({ status: 'ok' });
const getSite = () => structuredClone(site);
const getNavigation = () => structuredClone(navigation);

module.exports = { getHealth, getSite, getNavigation };

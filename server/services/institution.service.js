'use strict';

const { about, facilities } = require('../data/institution.data');

const getAbout = () => structuredClone(about);
const listFacilities = () => structuredClone({ items: facilities, total: facilities.length });

module.exports = { getAbout, listFacilities };

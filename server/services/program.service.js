'use strict';

const { programs } = require('../data/programs.data');
const { badRequest, notFound } = require('../errors');

const LEVELS = ['college', 'shs'];
const ID_PATTERN = /^[a-z0-9-]+$/;

function listPrograms(level) {
  if (level !== undefined && !LEVELS.includes(level)) {
    throw badRequest(`Query parameter 'level' must be one of: ${LEVELS.join(', ')}.`, [
      { field: 'level', message: `Must be one of: ${LEVELS.join(', ')}.` },
    ]);
  }
  const items = level ? programs.filter((program) => program.level === level) : programs;
  return structuredClone({ items, total: items.length });
}

function getProgram(id) {
  if (!ID_PATTERN.test(id)) {
    throw badRequest(`Path parameter 'id' is malformed: '${id}'.`, [
      { field: 'id', message: 'Must contain only lowercase letters, digits and hyphens.' },
    ]);
  }
  const program = programs.find((item) => item.id === id);
  if (!program) throw notFound(`Program '${id}' was not found.`);
  return structuredClone(program);
}

module.exports = { listPrograms, getProgram };

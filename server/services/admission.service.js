'use strict';

const admission = require('../data/admission.data');
const { programs } = require('../data/programs.data');

const getRequirements = () => structuredClone(admission.requirements);
const getProcess = () => structuredClone(admission.process);
const getPaymentInstructions = () => structuredClone(admission.paymentInstructions);

/**
 * Tuition rows reference programs by id so names stay consistent with /programs.
 * Rows without a matching program (BSIT) carry their own display name.
 */
function getTuition() {
  const groups = admission.tuition.groups.map((group) => ({
    ...group,
    rows: group.rows.map((row) => {
      const program = programs.find((item) => item.id === row.programId);
      return {
        programId: row.programId,
        program: program ? program.fullName : row.program,
        estimatedFee: row.estimatedFee,
      };
    }),
  }));
  return structuredClone({ ...admission.tuition, groups });
}

module.exports = { getRequirements, getProcess, getTuition, getPaymentInstructions };

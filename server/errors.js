'use strict';

/**
 * Domain error carrying everything needed to render an RFC 9457 Problem Details body.
 * Services throw these; the error middleware turns them into `application/problem+json`.
 */
const PROBLEM_BASE_URI = 'https://idsc.example/problems';

const TITLES = {
  400: 'Bad Request',
  404: 'Not Found',
  500: 'Internal Server Error',
};

const TYPES = {
  400: `${PROBLEM_BASE_URI}/validation-error`,
  404: `${PROBLEM_BASE_URI}/not-found`,
  500: `${PROBLEM_BASE_URI}/internal-error`,
};

class ProblemError extends Error {
  /**
   * @param {400|404|500} status HTTP status code
   * @param {string} detail Human-readable explanation of this occurrence
   * @param {Array<{field: string, message: string}>} [errors] Field-level validation errors (400)
   */
  constructor(status, detail, errors) {
    super(detail);
    this.name = 'ProblemError';
    this.status = status;
    this.errors = errors;
  }
}

const badRequest = (detail, errors) => new ProblemError(400, detail, errors);
const notFound = (detail) => new ProblemError(404, detail);

/** Builds the Problem Details body for a given status. `instance` is the request path + query. */
function toProblemBody(status, detail, instance, errors) {
  const body = {
    type: TYPES[status] ?? TYPES[500],
    title: TITLES[status] ?? TITLES[500],
    status,
    detail,
    instance,
  };
  if (errors && errors.length > 0) body.errors = errors;
  return body;
}

module.exports = { ProblemError, badRequest, notFound, toProblemBody };

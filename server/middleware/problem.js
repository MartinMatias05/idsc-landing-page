'use strict';

const { ProblemError, toProblemBody } = require('../errors');

const PROBLEM_CONTENT_TYPE = 'application/problem+json';

function send(res, status, detail, instance, errors) {
  res.status(status).type(PROBLEM_CONTENT_TYPE).json(toProblemBody(status, detail, instance, errors));
}

/** Any request that matched no route under /api/v1. */
function notFoundHandler(req, res) {
  send(res, 404, `No endpoint matches ${req.method} ${req.path}.`, req.originalUrl);
}

/**
 * Central error handler (must keep the 4-argument signature for Express).
 * Unexpected errors are logged server-side and returned without internals.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof ProblemError) {
    return send(res, err.status, err.message, req.originalUrl, err.errors);
  }
  console.error(err);
  return send(res, 500, 'An unexpected error occurred.', req.originalUrl);
}

module.exports = { notFoundHandler, errorHandler };

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');

const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/problem');

const API_PREFIX = '/api/v1';
const OPENAPI_PATH = path.join(__dirname, 'openapi.yaml');

/**
 * Builds the Express app. Kept separate from server.js so tests can start it on any port.
 * @param {{ frontendUrl?: string }} [options]
 */
function createApp({ frontendUrl = 'http://localhost:5173' } = {}) {
  const app = express();
  app.disable('x-powered-by');

  // Read-only API: allow only the known dev origins and GET/HEAD/OPTIONS (no wildcard).
  const allowedOrigins = [frontendUrl, frontendUrl.replace('localhost', '127.0.0.1')];
  app.use(cors({ origin: allowedOrigins, methods: ['GET', 'HEAD', 'OPTIONS'] }));

  // Swagger UI renders the very same file that is the API contract.
  const openapiDocument = yaml.load(fs.readFileSync(OPENAPI_PATH, 'utf8'));
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(openapiDocument, { customSiteTitle: 'IDSC Landing Page API' }),
  );

  app.use(API_PREFIX, routes);
  app.use(API_PREFIX, notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp, API_PREFIX };

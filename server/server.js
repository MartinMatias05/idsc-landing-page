'use strict';

// .env is optional; fall back to defaults when it is absent.
try {
  process.loadEnvFile();
} catch {
  /* no .env file */
}

const { createApp } = require('./app');

const PORT = Number(process.env.PORT) || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

createApp({ frontendUrl: FRONTEND_URL }).listen(PORT, () => {
  console.log(`Landing Page API  http://localhost:${PORT}/api/v1`);
  console.log(`Swagger UI        http://localhost:${PORT}/docs`);
});

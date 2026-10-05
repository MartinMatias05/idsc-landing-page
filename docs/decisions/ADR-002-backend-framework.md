# ADR-002: Use Node.js with Express for the Backend

## Status

Accepted

## Context

The rubric allows any backend framework the group knows and requires the layers routes → services → data, Problem Details errors and Swagger UI at `/docs`.

## Decision

Use Node.js (20.12+) with Express 4, `swagger-ui-express` and `js-yaml`. Express is small enough to keep routes thin, has first-class middleware for CORS and central error handling, and Swagger UI can load the same `openapi.yaml` that is linted and tested. The team already uses JavaScript on the React client, so one language covers both ends.

## Consequences

* Express does not validate requests from the OpenAPI file; validation is explicit in services and covered by tests.
* Only a few runtime dependencies (`express`, `cors`, `swagger-ui-express`, `js-yaml`) keep installation light.
* Express 4 forwards synchronous throws to the error middleware, which the services rely on.

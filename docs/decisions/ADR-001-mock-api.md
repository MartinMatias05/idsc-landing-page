# ADR-001: Use In-Memory Mock API

## Status

Accepted

## Context

The midterm assesses API design, contracts, prototypes and documentation, not persistence. The class builds 8 modules in parallel, and other groups need a working, documented Landing Page API they can call or mock. Teams also do not yet share an agreed storage technology, and the rubric states "no database yet".

## Decision

The Landing Page API serves mock data from in-memory JavaScript modules in `server/data/`. Services return copies of that data, so requests cannot change it. No database, ORM, authentication or user accounts are installed or configured. A test fails if a database or auth dependency is added.

## Consequences

* The API is demonstrable with `npm install` and one command, and Swagger "Try it out" works immediately.
* Data resets when the server restarts. That is expected.
* The contract (`openapi.yaml`) stays the source of truth. Because routes call services and services call only the data layer, a database-backed repository can later replace `server/data/*` without changing the contract or the client.
* Values owned by other modules (student and faculty counts) are mock until those modules' APIs are available.

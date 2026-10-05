# Landing Page Module — IDSC College Management System

## About the Module

The **Landing Page Module** is the public-facing entry point of the College Management System developed for **Infotech Development System Colleges, Inc. (IDSC), Ligao City**.

The module provides public information about the institution, including:

- College identity and contact information
- Main navigation
- News and announcements
- Enrollment information
- IDSC Pulse content
- Programs and academic tracks
- Admission requirements and process
- Tuition and payment information
- About IDSC
- Facilities

The Landing Page is designed to provide visitors with a clear starting point for accessing the different services and modules of the College Management System.

> **Midterm scope:** The backend currently uses mock/in-memory data. No database, authentication system, user accounts, or write endpoints are included in this module's midterm implementation.

---

## Users

| User | What they do in this module |
|---|---|
| Visitors | View public information about IDSC |
| Prospective Students | Explore programs, admission requirements, enrollment information, and payment instructions |
| Parents/Guardians | Review admission, enrollment, and institutional information |
| Students | Access public information and links to student-related systems |
| Faculty/Staff | Access public institutional information and links to applicable systems |
| Administrators | Maintain and review public landing-page content through the module's backend during development |

---

## Features

### Public Website

- Responsive landing page
- IDSC branding and navigation
- Search interface
- Apply Now call-to-action
- News and announcements
- Enrollment information
- IDSC Pulse section
- Statistics section
- Programs and tracks
- Admission information
- About IDSC
- Facilities information
- Footer and institutional links

### API

- REST API under `/api/v1`
- OpenAPI contract
- Swagger UI
- Mock/in-memory data
- RFC 9457 Problem Details for API errors
- CORS configuration
- Contract and HTTP tests
- No database dependency for the midterm implementation

### Frontend

- React
- Vite
- Responsive component structure
- Figma-based visual implementation
- Centralized API service layer
- Centralized external-system configuration

---

## Part of the College Management System

The Landing Page is one of the eight modules of the College Management System.

| Module | Repo |
|---|---|
| Landing Page | idsc-landing-page |
| Student | |
| Faculty |  |
| Registrar |  |
| Finance |  |
| Library |  |
| Clinic |  |
| Inventory |  |

The Landing Page does **not** directly access another module's database or source code.

Integration between modules is handled through defined API or external-system boundaries.

---

## Team

| Role | Member | Guthub |
|---|---|---|
| Backend | Edrei Purtogal |  |
| Frontend | Martin Matias | @MartinMatias05 |
| Documentation | Kimi Gaerlan | README, project documentation, documentation deliverables and handout |

### Additional Project Contribution

The primary responsibility of **Martin Matias** is frontend development. Backend implementation and support may also be contributed when required to keep the module functional and integrated.

---

## Technology Stack

| Part | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| API Contract | OpenAPI 3.1 |
| API Documentation | Swagger UI |
| Testing | Node.js Test Runner + Ajv |
| API Linting | Redocly CLI |
| Icons | Lucide React |
| Version Control | Git + GitHub |
| Data | Mock/in-memory data. Planned: MongoDb Compass |

No database is required for the Landing Page midterm implementation.

---

## Project Structure

```text
.
├── client/
│   ├── public/
│   │   └── assets/
│   └── src/
│       ├── components/
│       ├── config/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       ├── sections/
│       ├── services/
│       └── styles/
│
├── server/
│   ├── openapi.yaml
│   ├── app.js
│   ├── server.js
│   ├── errors.js
│   ├── routes/
│   ├── services/
│   ├── data/
│   ├── middleware/
│   └── tests/
│
├── docs/
│   ├── api-overview.md
│   ├── architecture.md
│   ├── data-model.md
│   ├── design-system.md
│   ├── integration.md
│   └── decisions/
│
├── CONTRIBUTING.md
├── package.json
├── redocly.yaml
└── README.md

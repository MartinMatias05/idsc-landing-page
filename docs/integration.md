# Integration

## Ports

| Module | Port | Source |
|---|---|---|
| Landing Page API | `3001` | **Provisional development default.** No class-assigned port was available when this was written; update here and in `server/.env.example` if the class assigns one |
| Landing Page client | `5173` | Vite default |

## Data this module sends

| To | Data | Endpoint |
|---|---|---|
| Any module's client | Header/footer navigation and branding, so every module looks like one app | `GET /navigation`, `GET /site` |
| Registrar | Public program names and codes | `GET /programs` |
| Finance | Published payment instructions (reference copy) | `GET /admission/payment-instructions` |

## Data this module gets

| From | Data | Status |
|---|---|---|
| Registrar | Enrolled-student count | **Temporary mock value** (`2,120`) in `GET /statistics`, flagged `provider.isMock: true`. Production must call the Registrar REST API. |
| Faculty | Full-time faculty count | **Temporary mock value** (`34`), same flag. Production must call the Faculty REST API. |
| Student Portal | Destination of the footer "Students" link | Link only; no data exchanged |
| Clinic | None. The Facilities → Clinic page is public information; clinic operations stay in the Clinic module | — |

The Landing Page never reads another module's database, imports its code or shares a data model.

## Using other groups' APIs before they exist

Run a Prism mock of their `openapi.yaml`:

```bash
npx @stoplight/prism-cli mock path/to/their/openapi.yaml -p 4010
```

## Agreements Log

Entries marked **Proposed** are what this module will ask other groups to confirm; they are not yet agreed.

| Date | With | Topic | Agreement | Status |
|---|---|---|---|---|
| 2026-10-05 | Registrar | Enrolled-student count | Registrar exposes a read-only count; Landing Page calls it instead of storing it | Proposed |
| 2026-10-05 | Faculty | Full-time faculty count | Faculty exposes a read-only count; Landing Page calls it | Proposed |
| 2026-10-05 | Student Portal | "Students" footer link | Landing Page links to the Student Portal entry URL | Proposed |
| 2026-10-05 | Finance | Payment instructions | Decide whether Landing Page or Finance owns this text (Landing Page owns it for now) | Proposed |
| 2026-10-05 | All groups | Shared header/footer | Other modules reuse this module's branding and navigation from `/site` and `/navigation` | Proposed |

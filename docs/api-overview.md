# API Overview

The OpenAPI file `server/openapi.yaml` is authoritative. This page explains conventions.

## Conventions

* Base path `/api/v1`; JSON only; read-only (`GET`).
* Collections are `{ "items": [...], "total": n }`; single resources are plain objects.
* Dates are ISO `YYYY-MM-DD`; money is a plain number in pesos (`null` when unpublished). Clients format as `Sep 25, 2026` and `₱1,500.00`.
* Images are `{ url, alt }`; `url` points to a file served by the client under `/assets`.
* Emphasis in payment steps uses `**bold**` markers.
* Icons are Lucide names (for example `megaphone`).

## Errors (RFC 9457)

```json
{
  "type": "https://idsc.example/problems/not-found",
  "title": "Not Found",
  "status": 404,
  "detail": "News article 'news-999' was not found.",
  "instance": "/api/v1/news/news-999"
}
```

| Status | When |
|---|---|
| 400 | `level` is not `college` or `shs`; an `id` does not match `^[a-z0-9-]+$`. Includes `errors: [{ field, message }]` |
| 404 | Unknown `id`, or an unknown route under `/api/v1` |
| 500 | Unexpected failure (details are logged, never returned) |

## Layering

`routes` map a path to one service call. `services` validate input, shape results and throw `ProblemError`. `data` holds the mock records. Services never return references to the data; they return copies.

# IDSC Landing Page Client

React + Vite frontend for Infotech Development System Colleges, Inc. (IDSC), Ligao City.

## Quick start

```bash
npm install
npm run dev
```

The client expects the Landing Page Express API at:

`http://localhost:3001/api/v1`

See [SETUP.md](./SETUP.md) for the complete procedure and [SYSTEM-DESIGN.md](./SYSTEM-DESIGN.md) for architecture and seven-system integration rules.

## Build

```bash
npm run build
```

## Important

- Do not hard-code URLs for the seven external systems in React components.
- Use `.env` values defined in `.env.example`.
- Do not connect directly to another group's database.
- Replace development SVG placeholders with approved IDSC/Figma assets before final submission.

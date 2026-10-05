# IDSC Landing Page — Client Setup

## 1. Where this package goes

This package is the **frontend client only**. Extract the contents into:

`landing-page/client`

Do **not** replace the existing `server/` folder. The server/API is already working.

Expected structure:

```text
landing-page/
├── client/          ← this package
├── server/          ← existing working Express mock API
├── docs/
└── README.md
```

## 2. Install

Open VS Code terminal:

```bash
cd C:\Users\matia\Documents\landing-page\client
npm install
```

## 3. Configure environment

Copy:

```text
.env.example → .env
```

Keep this during local development:

```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
```

Leave the seven external system URLs blank until each owning group gives the official URL.

## 4. Run backend first

Terminal 1:

```bash
cd C:\Users\matia\Documents\landing-page\server
npm run dev
```

Expected:

```text
Landing Page API  http://localhost:3001/api/v1
Swagger UI        http://localhost:3001/docs
```

## 5. Run frontend

Terminal 2:

```bash
cd C:\Users\matia\Documents\landing-page\client
npm run dev
```

Open:

`http://localhost:5173`

## 6. Production check

```bash
npm run build
npm run preview
```

A successful build should finish with Vite's `dist` output and no compilation errors.

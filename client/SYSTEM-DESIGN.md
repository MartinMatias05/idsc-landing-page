# IDSC Landing Page — System Design & Integration Guide

## 1. Purpose

The Landing Page is the **public-facing hub** of the College Management System. It presents official IDSC information and sends users to the other school systems when a function belongs to another module.

The Landing Page must remain independently deployable.

### Core boundary

```text
                 ┌──────────────────────┐
                 │   IDSC Landing Page  │
                 │ React + Vite         │
                 └──────────┬───────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
        Public content               External hand-offs
              │                           │
              ▼                           ▼
       Express Mock API          7 independent systems
       /api/v1/*                 Library / Student / Finance
                                 Faculty / Clinic / Registrar
                                 Inventory
```

The Landing Page **does not access another group's database** and must not import another group's source code.

## 2. Layers

### Presentation

`src/components/` contains reusable UI pieces:

- Header
- Footer
- Button
- SectionHeading
- Icon
- LoadingState
- ErrorState

### Page/section composition

`src/pages/` and `src/sections/` compose the approved Figma structure:

```text
Header
Hero / News
What's Happening
Enrollment
IDSC Pulse
Statistics
Final CTA / Admissions Support
Footer
```

### API layer

`src/services/api.js` is the only place where React components call the Landing Page API.

Do not put `fetch()` calls directly inside visual components.

### External systems layer

`src/config/systems.config.js` defines the seven systems.

`src/services/systems.js` resolves their URLs from Vite environment variables.

This means a URL change requires configuration only, not component rewrites.

## 3. API flow

Example:

```text
HomePage
   ↓
useApi(api.getNews)
   ↓
src/services/api.js
   ↓
GET /api/v1/news
   ↓
Express mock API
   ↓
JSON response
   ↓
NewsSection
```

The same pattern is used for site, navigation, enrollment, pulse, and statistics.

## 4. Seven-system integration rule

Use this rule throughout the project:

> **Landing Page → External System URL**

Do not do:

```text
Landing Page → Other System Database       ❌
Landing Page → Other System source code     ❌
Landing Page → Other System internal route  ❌
Landing Page → Other System authentication  ❌
```

Do:

```text
Landing Page → configured public URL        ✅
```

### Configuration example

```env
VITE_SYSTEM_STUDENT_PORTAL_URL=https://example-school-system.edu/students
```

If the value is empty, the Landing Page treats the system as **not configured yet** instead of crashing.

## 5. Navigation ownership

The Landing Page owns public navigation and presentation.

Operational data belongs to the responsible module.

Examples:

- Student records → Registrar/Student system
- Faculty records → Faculty system
- Clinic operations → Clinic system
- Finance transactions → Finance system
- Inventory operations → Inventory system

The Landing Page may show approved summary/mock information, but it must not become the owner of those operational datasets.

## 6. Figma → React mapping

| Figma area | React implementation |
|---|---|
| Header / Top Bar | `Header.jsx` |
| Main navigation | `Header.jsx` |
| News hero | `Hero.jsx` |
| What's happening | `NewsSection.jsx` |
| Enrollment hero | `EnrollmentSection.jsx` |
| IDSC Pulse | `PulseSection.jsx` |
| Statistics rings | `StatsSection.jsx` |
| Final CTA | `CtaSection.jsx` |
| Admissions support | `CtaSection.jsx` |
| Footer | `Footer.jsx` |

The CSS intentionally uses the visual language already identified from the approved Figma file: forest green, yellow accents, white cards, rounded surfaces, soft shadows, bold geometric headings, compact uppercase labels, and responsive grids.

## 7. Asset rule

The included SVGs are **local development placeholders** so the application can run without depending on external image hosts.

Replace them with approved IDSC/Figma assets when official image files are available.

Do not commit copyrighted/random internet images as final school assets.

## 8. Responsive behavior

Desktop:

- Full navigation
- Three-column news/pulse cards
- Two-column enrollment section
- Three statistics rings
- Two-column CTA/support card

Tablet:

- Collapsible navigation
- Two-column content grids
- Stacked CTA where required

Mobile:

- Hamburger navigation
- Single-column cards
- Stacked enrollment artwork
- Stacked statistics
- Stacked CTA buttons
- Footer columns collapse to one column

## 9. Error handling

If the API is unavailable:

1. The Landing Page must not crash.
2. Show a simple retry state.
3. Keep the visual shell available where possible.
4. Do not expose stack traces to users.

If an external system URL is not configured:

1. Do not navigate to a fake URL.
2. Do not hard-code a replacement URL.
3. Mark the destination as unavailable/not configured.
4. Update `.env` when the owning group supplies the final URL.

## 10. Midterm architecture principle

The project should be explainable in one sentence during the defense:

> **IDSC Landing Page is an independently deployable React frontend backed by its own documented mock API, while cross-module integration is handled through configurable external URLs rather than shared databases or internal implementation dependencies.**

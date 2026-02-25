# MyHomeGym

An **offline-first** web app for gym training tracking.

Take your training to the next level with a digital experience that adapts to you. This application eliminates unnecessary distractions, allowing you to log your activity intuitively and quickly. With dynamic visual tools and immediate feedback, it transforms your data into motivation, helping you visualize progress and maintain consistency no matter where you train.

This is also a hobby project built to challenge paid fitness apps that limit user experience behind paywalls and restrictions.

## Project Goal

Build a training app that works locally in the browser (no mandatory backend), prioritizing:

- Fast workout logging
- Clear progress across key metrics
- Simple routine and exercise management
- Robust local persistence

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS
- Dexie (IndexedDB) for local storage
- React Hook Form + Zod for forms and validation
- Zustand for UI state
- Recharts for progress visualization

## Current Features

- Initial onboarding with profile creation and BMI calculation
- Dashboard with recent training metrics
- Guided routine workouts and free training mode
- Detailed logging by exercise/set/reps/weight
- Routine management (create, edit, enable/disable, delete)
- Exercise assignment to routines with reordering
- Exercise catalog with filters
- Create, edit, and delete custom exercises
- Progress views with weight/BMI charts, volume, heatmap, and interactive body diagram
- Automatic PR detection and dedicated PR panel
- Local export/import (JSON/CSV) and PDF summary
- Profile page with data summary and theme preference
- PWA with offline support

## Navigation

Main app routes:

- `/` → Dashboard
- `/entrenar` → Training logging
- `/rutinas` → Routine management
- `/catalogo` → Exercise catalog
- `/progreso` → Metrics and charts
- `/perfil` → Profile and theme
- `/configuracion` → Backup/restore, PDF, maintenance, and notifications

If no profile exists, onboarding is shown before enabling full navigation.

## Scripts

- `npm run dev`: starts the development server
- `npm run build`: compiles TypeScript and generates a production build
- `npm run preview`: previews the generated build
- `npm run lint`: runs ESLint

## Main Structure

- `src/pages`: main app screens
- `src/components`: reusable components (layout, profile, workout, analytics, etc.)
- `src/lib/db.ts`: local database schema (Dexie)
- `src/lib/bootstrap.ts`: initial exercise seed loading on first run
- `src/stores`: global UI state (theme/sidebar)
- `src/constants/defaultExercises.ts`: default exercise seed list

## Data Model (IndexedDB + Dexie)

Current tables:

- `userProfile`: user profile
- `ejerciciosCatalogo`: base catalog + custom exercises
- `rutinas`: user routines
- `rutinaEjercicios`: routine-exercise relation
- `entrenamientosRegistrados`: logged workout sessions
- `ejerciciosRealizados`: performed exercise details
- `medidasCorporalesHistorico`: body measurements history
- `prs`: personal records

Local database name: `gym_offline_db`.

## Offline-First Flow

1. The app initializes Dexie on load.
2. If the catalog is empty, default exercises are seeded.
3. All CRUD operations run on local IndexedDB.
4. The UI updates reactively via `useLiveQuery`.

No internet connection is required after the app is installed.

## Run Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start development mode:

   ```bash
   npm run dev
   ```

3. Open the URL shown by Vite (default: `http://localhost:5173`).

## Notes

- The app runs on browser IndexedDB; data stays on-device.
- To reset test data, clear site storage from browser DevTools.

## Current Status & Suggested Next Steps

Current status: extended functional MVP, fully offline-capable, with routines, progress analytics, PRs, and local backup.

Recommended next improvements:

- Integration tests for critical flows (onboarding, routines, workout logging, backup)
- Additional performance optimization (more code-splitting and profiling)
- Accessibility upgrades (full audit and keyboard navigation across all flows)

## Extended Documentation

To execute the full project by phases (master plan), use:

- [docs/MASTER_PLAN.md](docs/MASTER_PLAN.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/SETUP_AND_DEPENDENCIES.md](docs/SETUP_AND_DEPENDENCIES.md)
- [docs/IMPLEMENTATION_ORDER.md](docs/IMPLEMENTATION_ORDER.md)

Recommended workflow order: follow [docs/IMPLEMENTATION_ORDER.md](docs/IMPLEMENTATION_ORDER.md) top to bottom.

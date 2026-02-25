# PROJECT HEVY - MASTER DEVELOPMENT PLAN

Last updated: 2026-02-23

## 1) Overview

Offline-first web app for complete gym training management, with local persistence (IndexedDB), no mandatory authentication, and a focus on fast daily use.

## 2) Target functional scope

- Exercise catalog (base + custom)
- Routine builder
- Workout logging
- Progress and statistics
- Interactive body diagram
- Automatic PRs
- Muscle balance recommendations
- Local export/import
- Dark mode
- Responsive/PWA experience

## 3) Current real status (repo)

Implemented:
- Profile onboarding + BMI
- Basic dashboard
- Guided and detailed logging by sets/reps/weight
- Routines: create/edit, enable/disable, delete, assign exercises, and reorder
- Catalog: search/filter + create/edit/delete custom exercises
- Progress with charts, heatmap, PRs, and interactive body diagram
- Profile with theme preference
- Local export/import (JSON/CSV) and PDF export
- Active PWA

Main pending items:
- End-to-end integration tests for critical flows
- Final performance/accessibility optimization

## 4) Current stack (source: package.json)

- React 19 + TypeScript 5.9 + Vite 7
- React Router 7
- Dexie 4 + dexie-react-hooks
- React Hook Form + Zod
- Zustand
- Recharts
- Tailwind CSS

## 5) Target stack for advanced features

Suggested dependencies for next phases:

- Drag and drop: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- Dates/streaks: `date-fns`
- PDF export: `jspdf`, `jspdf-autotable`
- PWA: `vite-plugin-pwa`, `workbox-window`
- Testing: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`

## 6) Architecture principles

- Offline-first: every core operation persists in Dexie
- Local reactivity: reads via `useLiveQuery`
- Typed forms with RHF + Zod
- UI state in Zustand (theme/layout)
- Lean page components + logic moved to hooks/services

## 7) Domain conventions

- Persist dates as ISO strings
- IDs generated with `crypto.randomUUID()`
- Keep property names in camelCase (aligned with repo)
- Avoid complex business logic inside UI components

## 8) Technical risks and mitigation

- Risk: page-level logic growth
  - Mitigation: create domain hooks (`useWorkouts`, `useRoutines`, etc.)
- Risk: data inconsistencies across tables
  - Mitigation: Dexie transactions for composite operations
- Risk: testing debt
  - Mitigation: add tests from critical utilities outward to features

## 9) Definition of a “complete MVP”

The MVP is considered complete when these are ready:
- Routine CRUD with exercise assignment
- Workout logging by sets/reps/weight
- Dashboard + Progress with consistent metrics
- Automatic PRs visible in UI
- JSON export/import

## 10) Documentation deliverables

- `docs/ARCHITECTURE.md`
- `docs/SETUP_AND_DEPENDENCIES.md`
- `docs/IMPLEMENTATION_ORDER.md`
- `README.md` as the startup index

# Technical Architecture

## 1) Main modules

- `src/pages`: route-based view composition
- `src/components`: reusable UI (layout/profile)
- `src/lib/db.ts`: Dexie schema + tables
- `src/lib/bootstrap.ts`: initial exercise seed
- `src/stores/ui-store.ts`: persisted UI state
- `src/types/models.ts`: domain contracts
- `src/utils/calculations.ts`: calculations (BMI, etc.)

## 2) Active routes

- `/` Dashboard
- `/entrenar` Quick logging
- `/rutinas` Routine management
- `/catalogo` Catalog
- `/progreso` Charts
- `/diagrama` Body measurements
- `/perfil` Profile/theme

## 3) Data model (Dexie)

Database: `gym_offline_db`

Tables:
- `userProfile`
- `ejerciciosCatalogo`
- `rutinas`
- `rutinaEjercicios`
- `entrenamientosRegistrados`
- `ejerciciosRealizados`
- `medidasCorporalesHistorico`
- `prs`

Current indexes (summary):
- Search by name/group/difficulty in exercises
- Filters by routine/date in workouts
- `rutinaId` relation in `rutinaEjercicios`

## 4) Startup flow

1. App starts
2. `bootstrapDatabase()` validates exercise seed
3. `userProfile` is queried
4. No profile: onboarding
5. Profile exists: main router

## 5) Recommended data flow (target)

For advanced features:

- Pages
  -> Domain hooks (`useRoutines`, `useWorkouts`, `useProgress`)
  -> Data services (`lib/services/*`)
  -> Dexie (`db`)

This separates UI from logic and improves testability.

## 6) Consistency rules

- Multi-table operations in `db.transaction('rw', ...)`
- `updatedAt` must always be updated on mutations
- Routine deletion must also clean `rutinaEjercicios`
- Input boundary validations (Zod)

## 7) Layered target architecture

- Presentation: `components`, `pages`
- Application: `hooks`, use cases
- Infrastructure: `lib/db`, export/import, PWA
- Domain: `types/models`, calculation rules

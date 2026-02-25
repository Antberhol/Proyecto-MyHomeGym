# PROYECTO HEVY - PLAN MAESTRO DE DESARROLLO

Última actualización: 2026-02-23

## 1) Visión general

Aplicación web offline-first para gestión completa de entrenamiento de gimnasio, con persistencia local (IndexedDB), sin autenticación obligatoria y foco en uso diario rápido.

## 2) Alcance funcional objetivo

- Catálogo de ejercicios (base + personalizados)
- Constructor de rutinas
- Registro de entrenamientos
- Progreso y estadísticas
- Diagrama corporal interactivo
- PRs automáticos
- Recomendaciones por equilibrio muscular
- Exportación/importación local
- Modo oscuro
- Experiencia responsive/PWA

## 3) Estado real actual (repo)

Implementado:
- Onboarding de perfil + IMC
- Dashboard básico
- Registro guiado y detallado por series/reps/peso
- Rutinas: crear/editar, activar/desactivar, borrar, asignar ejercicios y reordenar
- Catálogo: búsqueda/filtro + crear/editar/borrar personalizados
- Progreso con gráficas, heatmap, PRs y diagrama corporal interactivo
- Perfil con tema
- Exportación/importación local (JSON/CSV) y exportación PDF
- PWA activa

Pendiente principal:
- Tests de integración end-to-end de flujos críticos
- Optimización final de performance/accesibilidad

## 4) Stack actual (fuente: package.json)

- React 19 + TypeScript 5.9 + Vite 7
- React Router 7
- Dexie 4 + dexie-react-hooks
- React Hook Form + Zod
- Zustand
- Recharts
- Tailwind CSS

## 5) Stack objetivo para funcionalidades avanzadas

Dependencias sugeridas para próximas fases:

- Drag and drop: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- Fechas/racha: `date-fns`
- Exportación PDF: `jspdf`, `jspdf-autotable`
- PWA: `vite-plugin-pwa`, `workbox-window`
- Testing: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`

## 6) Principios de arquitectura

- Offline-first: toda operación principal persiste en Dexie
- Reactividad local: lecturas con `useLiveQuery`
- Formularios tipados con RHF + Zod
- Estado UI en Zustand (tema/layout)
- Componentes de página delgados + lógica movida a hooks/servicios

## 7) Convenciones de dominio

- Persistir fechas en ISO string
- IDs con `crypto.randomUUID()`
- Mantener nombres de propiedades en camelCase (alineado al repo)
- Evitar lógica de negocio compleja dentro de componentes de UI

## 8) Riesgos técnicos y mitigación

- Riesgo: crecimiento de lógica en páginas
  - Mitigación: crear hooks (`useEntrenamientos`, `useRutinas`, etc.)
- Riesgo: inconsistencias de datos entre tablas
  - Mitigación: transacciones Dexie para operaciones compuestas
- Riesgo: deuda de testing
  - Mitigación: introducir tests desde utilidades críticas hacia features

## 9) Definición de “MVP completo”

Se considera MVP completo cuando estén listos:
- CRUD de rutinas con asignación de ejercicios
- Registro de entrenamiento por series/reps/peso
- Dashboard + Progreso con métricas consistentes
- PRs automáticos visibles en UI
- Exportación/importación JSON

## 10) Entregables de documentación

- `docs/ARCHITECTURE.md`
- `docs/SETUP_AND_DEPENDENCIES.md`
- `docs/IMPLEMENTATION_ORDER.md`
- `README.md` como índice de arranque

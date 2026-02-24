# Arquitectura Técnica

## 1) Módulos principales

- `src/pages`: composición de vistas por ruta
- `src/components`: UI reutilizable (layout/perfil)
- `src/lib/db.ts`: esquema Dexie + tablas
- `src/lib/bootstrap.ts`: seed de ejercicios iniciales
- `src/stores/ui-store.ts`: estado UI persistido
- `src/types/models.ts`: contratos de dominio
- `src/utils/calculations.ts`: cálculos (IMC, etc.)

## 2) Rutas activas

- `/` Dashboard
- `/entrenar` Registro rápido
- `/rutinas` Gestión de rutinas
- `/catalogo` Catálogo
- `/progreso` Gráficas
- `/diagrama` Medidas corporales
- `/perfil` Perfil/tema

## 3) Modelo de datos (Dexie)

Base: `gym_offline_db`

Tablas:
- `userProfile`
- `ejerciciosCatalogo`
- `rutinas`
- `rutinaEjercicios`
- `entrenamientosRegistrados`
- `ejerciciosRealizados`
- `medidasCorporalesHistorico`
- `prs`

Índices actuales (resumen):
- Búsqueda por nombre/grupo/dificultad en ejercicios
- Filtros por rutina/fecha en entrenamientos
- Relación `rutinaId` en `rutinaEjercicios`

## 4) Flujo de arranque

1. Arranca app
2. `bootstrapDatabase()` valida seed de ejercicios
3. Se consulta `userProfile`
4. Sin perfil: onboarding
5. Con perfil: router principal

## 5) Flujo de datos recomendado (target)

Para funcionalidades avanzadas:

- Páginas
  -> Hooks de dominio (`useRutinas`, `useEntrenamientos`, `useProgreso`)
  -> Servicios de datos (`lib/services/*`)
  -> Dexie (`db`)

Esto separa UI de lógica y facilita test.

## 6) Reglas de consistencia

- Operaciones multi-tabla en `db.transaction('rw', ...)`
- `updatedAt` siempre actualizado en mutaciones
- Borrado de rutina debe limpiar `rutinaEjercicios`
- Validaciones en frontera de entrada (Zod)

## 7) Arquitectura objetivo por capas

- Presentación: `components`, `pages`
- Aplicación: `hooks`, casos de uso
- Infraestructura: `lib/db`, export/import, PWA
- Dominio: `types/models`, reglas de cálculo

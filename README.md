# Proyecto Hevy

Aplicación web **offline-first** para seguimiento de entrenamiento de gimnasio.

## Objetivo del proyecto

Construir una app de entrenamiento que funcione localmente en navegador (sin backend obligatorio), priorizando:

- Registro rápido de sesiones
- Progreso visible en métricas clave
- Gestión simple de rutinas y ejercicios
- Persistencia local robusta

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS
- Dexie (IndexedDB) para almacenamiento local
- React Hook Form + Zod para formularios y validación
- Zustand para estado de UI
- Recharts para visualización de progreso

## Funcionalidades actuales

- Onboarding inicial con creación de perfil y cálculo de IMC
- Dashboard con métricas de entrenamientos recientes
- Registro de entrenamientos guiado por rutina y entreno libre
- Registro detallado por ejercicio/serie/repeticiones/peso
- Gestión de rutinas (crear, editar, activar/desactivar, borrar)
- Asignación de ejercicios a rutinas y reordenamiento
- Catálogo de ejercicios con filtros
- Creación, edición y borrado de ejercicios personalizados
- Progreso con gráficas de peso/IMC, volumen, heatmap y diagrama corporal interactivo
- PRs automáticos y panel específico de PRs
- Exportación/importación local (JSON/CSV) y resumen PDF
- Perfil con resumen de datos y preferencia de tema
- PWA con soporte offline

## Navegación

Rutas principales de la app:

- `/` → Dashboard
- `/entrenar` → Registro de entrenamiento
- `/rutinas` → Gestión de rutinas
- `/catalogo` → Catálogo de ejercicios
- `/progreso` → Métricas y gráficos
- `/perfil` → Perfil y tema
- `/configuracion` → Backup/restore, PDF, mantenimiento y notificaciones

Si no existe perfil, la app muestra el onboarding antes de habilitar la navegación.

## Scripts

- `npm run dev`: inicia servidor de desarrollo
- `npm run build`: compila TypeScript y genera build de producción
- `npm run preview`: previsualiza el build generado
- `npm run lint`: ejecuta ESLint

## Estructura principal

- `src/pages`: vistas principales de la app
- `src/components`: componentes reutilizables de layout y perfil
- `src/lib/db.ts`: esquema de base de datos local (Dexie)
- `src/lib/bootstrap.ts`: carga de ejercicios semilla en primer arranque
- `src/stores`: estado global de interfaz (tema/sidebar)
- `src/constants/exercises.ts`: catálogo inicial de ejercicios

## Modelo de datos (IndexedDB + Dexie)

Tablas definidas actualmente:

- `userProfile`: perfil del usuario
- `ejerciciosCatalogo`: catálogo base + ejercicios personalizados
- `rutinas`: rutinas del usuario
- `rutinaEjercicios`: relación rutina-ejercicio
- `entrenamientosRegistrados`: sesiones registradas
- `ejerciciosRealizados`: detalle por ejercicio realizado
- `medidasCorporalesHistorico`: histórico corporal
- `prs`: récords personales

Base de datos local: `gym_offline_db`.

## Flujo offline-first

1. La app inicializa Dexie al cargar.
2. Si el catálogo está vacío, se insertan ejercicios semilla.
3. Toda operación CRUD se realiza sobre IndexedDB local.
4. La UI se reactualiza usando `useLiveQuery`.

No se requiere conexión a internet para operar una vez descargada la app.

## Ejecutar en local

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Levanta el entorno de desarrollo:

   ```bash
   npm run dev
   ```

3. Abre la URL mostrada por Vite (por defecto `http://localhost:5173`).

## Notas

- La app funciona sobre IndexedDB en el navegador; los datos quedan en el dispositivo.
- Si necesitas reiniciar datos de prueba, borra almacenamiento local del sitio desde las DevTools.

## Estado actual y próximos pasos sugeridos

Estado actual: MVP funcional extendido, operativo offline, con rutinas, progreso, PRs y backup local.

Siguientes mejoras recomendadas:

- Tests de integración de flujos críticos (onboarding, rutina, entreno, backup)
- Optimización adicional de performance (más code-splitting y profiling)
- Mejoras de accesibilidad (auditoría completa y navegación por teclado en todos los flujos)

## Documentación extendida

Para ejecutar el proyecto completo por fases (plan maestro), usa:

- [docs/MASTER_PLAN.md](docs/MASTER_PLAN.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/SETUP_AND_DEPENDENCIES.md](docs/SETUP_AND_DEPENDENCIES.md)
- [docs/IMPLEMENTATION_ORDER.md](docs/IMPLEMENTATION_ORDER.md)

Orden recomendado de trabajo: seguir [docs/IMPLEMENTATION_ORDER.md](docs/IMPLEMENTATION_ORDER.md) de arriba hacia abajo.

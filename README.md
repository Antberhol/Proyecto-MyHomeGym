# MyHomeGym

Aplicación web **offline-first** para registrar entrenamientos de gimnasio, gestionar rutinas, seguir progreso físico y conservar historial de rendimiento sin backend obligatorio.

Su objetivo principal es ofrecer una experiencia rápida, privada y mantenible: toda la operación core funciona en el navegador del usuario, con persistencia local en IndexedDB y comportamiento PWA.

---

## Tabla de contenidos

- [MyHomeGym](#myhomegym)
  - [Tabla de contenidos](#tabla-de-contenidos)
  - [1. Visión del proyecto](#1-visión-del-proyecto)
  - [2. Objetivos funcionales y no funcionales](#2-objetivos-funcionales-y-no-funcionales)
    - [Funcionales](#funcionales)
    - [No funcionales](#no-funcionales)
  - [3. Características actuales](#3-características-actuales)
  - [4. Stack tecnológico](#4-stack-tecnológico)
  - [5. Arquitectura y principios de diseño](#5-arquitectura-y-principios-de-diseño)
    - [Capas principales](#capas-principales)
    - [Convenciones clave](#convenciones-clave)
    - [Convención de nombres en repositorios](#convención-de-nombres-en-repositorios)
  - [6. Estructura del repositorio](#6-estructura-del-repositorio)
  - [7. Modelo de datos local](#7-modelo-de-datos-local)
  - [8. Flujo offline-first](#8-flujo-offline-first)
  - [9. Rutas principales de la app](#9-rutas-principales-de-la-app)
  - [10. Puesta en marcha (local)](#10-puesta-en-marcha-local)
    - [Requisitos previos](#requisitos-previos)
    - [Instalación](#instalación)
    - [Desarrollo](#desarrollo)
    - [Build de producción](#build-de-producción)
    - [Preview local del build](#preview-local-del-build)
  - [11. Scripts disponibles](#11-scripts-disponibles)
  - [12. Calidad: lint, build y testing](#12-calidad-lint-build-y-testing)
    - [Validación mínima antes de PR](#validación-mínima-antes-de-pr)
    - [Alcance recomendado de pruebas](#alcance-recomendado-de-pruebas)
  - [13. Exportación, backup y recuperación](#13-exportación-backup-y-recuperación)
  - [14. PWA y operación en producción](#14-pwa-y-operación-en-producción)
  - [15. Troubleshooting](#15-troubleshooting)
    - [La app no refleja cambios en desarrollo](#la-app-no-refleja-cambios-en-desarrollo)
    - [Error al compilar](#error-al-compilar)
    - [Datos inconsistentes en pruebas manuales](#datos-inconsistentes-en-pruebas-manuales)
    - [El temporizador terminó pero no hubo feedback](#el-temporizador-terminó-pero-no-hubo-feedback)
  - [16. Seguridad y privacidad](#16-seguridad-y-privacidad)
  - [17. Estado actual y roadmap sugerido](#17-estado-actual-y-roadmap-sugerido)
    - [Estado actual](#estado-actual)
    - [Próximos pasos sugeridos](#próximos-pasos-sugeridos)
  - [18. Documentación adicional](#18-documentación-adicional)
  - [19. Contribución](#19-contribución)

---

## 1. Visión del proyecto

MyHomeGym nace como alternativa local-first a apps de fitness con alta dependencia de servicios remotos. El foco está en:

- **Velocidad de registro** durante el entrenamiento.
- **Claridad de progreso** con métricas accionables.
- **Gestión simple de rutinas y catálogo** de ejercicios.
- **Control del usuario sobre sus datos** (persistencia local y exportación).

---

## 2. Objetivos funcionales y no funcionales

### Funcionales

- Registrar entrenamientos guiados por rutina y entrenamientos libres.
- Mantener catálogo de ejercicios (base + personalizados).
- Gestionar rutinas con orden de ejercicios y estado activo.
- Visualizar progreso (volumen, IMC, historial corporal, PRs, distribución muscular).
- Exportar e importar datos de manera local.

### No funcionales

- **Offline-first real** para funcionalidades core.
- **Baja latencia percibida** en operaciones frecuentes.
- **Mantenibilidad** mediante arquitectura por capas y repositorios.
- **Evolución segura** apoyada en TypeScript, linting y pruebas.

---

## 3. Características actuales

- Onboarding inicial con creación de perfil y cálculo de IMC.
- Dashboard con actividad reciente y métricas resumen.
- Modo de entrenamiento por rutina y modo libre.
- Registro detallado por ejercicio/serie/repeticiones/peso.
- Gestión completa de rutinas (crear, editar, activar/desactivar, eliminar).
- Asignación y reordenamiento de ejercicios dentro de rutinas.
- Catálogo con filtros y soporte de ejercicios personalizados.
- Panel de progreso con gráficas, distribución muscular y diagrama corporal interactivo.
- Detección automática de PRs (personal records).
- Exportación/importación local (JSON/CSV) y generación de PDF.
- Preferencias de usuario (tema) y configuración de mantenimiento.
- Soporte PWA con funcionamiento sin conexión para uso cotidiano.

---

## 4. Stack tecnológico

- **Frontend**: React 19 + TypeScript + Vite.
- **Estilos/UI**: Tailwind CSS, utilidades de diseño y componentes reutilizables.
- **Persistencia**: Dexie sobre IndexedDB.
- **Formularios y validación**: React Hook Form + Zod.
- **Estado de UI**: Zustand.
- **Visualización**: Recharts.
- **Interacción avanzada**: dnd-kit (sorting/reordenamiento), framer-motion.
- **PWA**: vite-plugin-pwa + workbox-window.
- **Calidad**: ESLint, Vitest, Testing Library, jsdom.

---

## 5. Arquitectura y principios de diseño

### Capas principales

1. **UI/Presentación**: páginas y componentes React.
2. **Aplicación**: hooks que orquestan casos de uso (p. ej. entrenamiento activo).
3. **Datos/Dominio**: repositorios por dominio funcional.
4. **Infraestructura**: acceso a Dexie/IndexedDB, eventos, utilidades de plataforma.

### Convenciones clave

- La UI no accede directamente a la base de datos.
- El acceso a datos desde UI/hooks se canaliza mediante repositorios en `src/repositories`.
- La base de datos está encapsulada en `src/lib/db.ts` con API pública controlada.
- El temporizador no invoca directamente audio/háptica: usa un evento pub/sub (`WORKOUT_TIMER_FINISHED_EVENT`).

### Convención de nombres en repositorios

- Lectura de colecciones: `list*`
- Lectura específica: `get*By*`
- Alta: `create*`
- Actualización: `update*`
- Eliminación: `delete*`
- Escritura idempotente: `upsert*`

> Detalle ampliado y rationale en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 6. Estructura del repositorio

Estructura relevante para desarrollo:

- `src/pages`: pantallas principales por ruta.
- `src/components`: componentes reutilizables (layout, workout, analytics, profile, etc.).
- `src/hooks`: hooks de aplicación y utilitarios de interacción.
- `src/repositories`: contratos de acceso a datos por dominio.
- `src/lib`: infraestructura (DB, bootstrap, backup/export, eventos, pwa).
- `src/stores`: estado global de UI.
- `src/constants`: datos base y catálogos iniciales.
- `src/utils`: lógica pura de apoyo (cálculos, helpers).
- `src/workers`: procesamiento analítico en worker cuando aplica.
- `tests`: configuración y pruebas unitarias.
- `docs`: arquitectura, plan maestro, orden de implementación y setup.

---

## 7. Modelo de datos local

Base local: `gym_offline_db`.

Tablas funcionales principales:

- `userProfile`: perfil del usuario.
- `ejerciciosCatalogo`: catálogo base + ejercicios personalizados.
- `rutinas`: rutinas definidas por el usuario.
- `rutinaEjercicios`: relación rutina-ejercicio + orden.
- `entrenamientosRegistrados`: sesiones completadas.
- `ejerciciosRealizados`: detalle de ejecución por ejercicio/serie.
- `medidasCorporalesHistorico`: histórico de medidas corporales.
- `prs`: récords personales detectados.

La app prioriza consistencia local y operaciones atómicas para escrituras compuestas.

---

## 8. Flujo offline-first

1. Inicialización de Dexie al cargar la aplicación.
2. Carga de catálogo semilla si no hay datos iniciales.
3. CRUD sobre IndexedDB para toda operación core.
4. Actualización reactiva de UI mediante consultas vivas.
5. Persistencia en dispositivo sin dependencia de red.

Resultado: tras instalar/cargar la app, el uso diario no requiere conexión para las funciones principales.

---

## 9. Rutas principales de la app

- `/` → Dashboard.
- `/entrenar` → Registro de entrenamiento.
- `/rutinas` → Gestión de rutinas.
- `/catalogo` → Catálogo de ejercicios.
- `/progreso` → Métricas y visualizaciones.
- `/perfil` → Perfil y preferencias.
- `/configuracion` → Exportación/importación, PDF, mantenimiento, notificaciones.

Si no existe perfil, se muestra onboarding antes de habilitar navegación completa.

---

## 10. Puesta en marcha (local)

### Requisitos previos

- Node.js 20+ recomendado.
- npm 10+ recomendado.

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

Vite mostrará la URL local (normalmente `http://localhost:5173`).

### Build de producción

```bash
npm run build
```

### Preview local del build

```bash
npm run preview
```

---

## 11. Scripts disponibles

- `npm run dev`: servidor de desarrollo.
- `npm run build`: compilación TypeScript + build Vite.
- `npm run preview`: previsualización del build.
- `npm run lint`: ejecución de ESLint.
- `npm run test`: ejecución de pruebas con Vitest.
- `npm run test:ui`: interfaz de Vitest para depuración visual de tests.

---

## 12. Calidad: lint, build y testing

### Validación mínima antes de PR

```bash
npm run lint
npm run build
npm run test
```

### Alcance recomendado de pruebas

- Lógica pura (`src/utils`, transformaciones, cálculos).
- Contratos de hooks de aplicación críticos.
- Componentes de alto impacto en flujos de entrenamiento.

Configuración de pruebas en `tests/setup.ts` y `vitest.config.ts`.

---

## 13. Exportación, backup y recuperación

El sistema incluye utilidades para:

- Exportar datos locales (formatos JSON/CSV).
- Generar reportes PDF.
- Reimportar datos previamente exportados.
- Ejecutar tareas de mantenimiento sobre almacenamiento local.

Flujo recomendado para resguardo:

1. Exportar backup antes de cambios grandes.
2. Verificar archivo generado.
3. Conservar copia en ubicación externa segura (cloud personal o disco externo).

---

## 14. PWA y operación en producción

- Build estático desplegable en hosting de archivos estáticos.
- Service Worker para soporte de caché/recursos.
- IndexedDB como fuente de verdad local del usuario.

Consideraciones:

- Si despliegas una nueva versión, puede requerirse refresco forzado para tomar el último Service Worker.
- Para pruebas de instalación PWA, usar navegador compatible y contexto HTTPS (o localhost).

---

## 15. Troubleshooting

### La app no refleja cambios en desarrollo

- Reinicia `npm run dev`.
- Limpia caché del navegador y recarga.
- Verifica que no exista un Service Worker antiguo activo en entorno local.

### Error al compilar

- Ejecuta `npm run lint` para detectar causas tempranas.
- Reinstala dependencias: elimina `node_modules` y ejecuta `npm install`.
- Revisa incompatibilidades de versión de Node.

### Datos inconsistentes en pruebas manuales

- Limpia almacenamiento del sitio desde DevTools.
- Reimporta un backup válido si corresponde.

### El temporizador terminó pero no hubo feedback

- Verifica permisos/capacidades del dispositivo para vibración/audio.
- Comprueba configuración de volumen/silencio del sistema.

---

## 16. Seguridad y privacidad

- Los datos se guardan localmente en el dispositivo del usuario.
- No existe backend obligatorio para el flujo principal.
- La exposición externa de datos depende de acciones explícitas de exportación del usuario.

Recomendación operativa: proteger el dispositivo con medidas básicas (PIN/biometría/cifrado de sistema), especialmente si contiene historial sensible.

---

## 17. Estado actual y roadmap sugerido

### Estado actual

MVP funcional extendido, offline-capable, con arquitectura por capas, repositorios por dominio, desacoplamiento por eventos para feedback de timer, y documentación técnica de soporte.

### Próximos pasos sugeridos

- Más pruebas de integración en flujos críticos (onboarding, entrenamiento, backup).
- Auditoría de accesibilidad (teclado, foco, semántica, lectores de pantalla).
- Perfilado de performance para pantallas con alto volumen de datos.
- Evolución opcional hacia sincronización cloud con estrategia conflict-safe.

---

## 18. Documentación adicional

- [docs/MASTER_PLAN.md](docs/MASTER_PLAN.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/SETUP_AND_DEPENDENCIES.md](docs/SETUP_AND_DEPENDENCIES.md)
- [docs/IMPLEMENTATION_ORDER.md](docs/IMPLEMENTATION_ORDER.md)

Orden recomendado de lectura técnica:

1. [docs/IMPLEMENTATION_ORDER.md](docs/IMPLEMENTATION_ORDER.md)
2. [docs/MASTER_PLAN.md](docs/MASTER_PLAN.md)
3. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
4. [docs/SETUP_AND_DEPENDENCIES.md](docs/SETUP_AND_DEPENDENCIES.md)

---

## 19. Contribución

Para estándares de arquitectura, política de deuda técnica, checklist de PR y estrategia de testing, consultar:

- [CONTRIBUTING.md](CONTRIBUTING.md)

Regla de oro de mantenimiento: cambios pequeños, validados y documentados.

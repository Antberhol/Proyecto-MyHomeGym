# Contributing Guide

## 1. Objetivo
Esta guía define reglas de contribución para mantener la calidad técnica de MyHomeGym con foco en mantenibilidad, bajo acoplamiento y evolución segura.

## 2. Flujo de trabajo recomendado
1. Crea una rama por cambio (feature/fix/docs).
2. Implementa cambios pequeños y atómicos.
3. Ejecuta validaciones locales antes de abrir PR:
   - `npm run lint`
   - `npm run build`
   - `vitest` (si aplica a tu cambio)
4. Documenta decisiones relevantes en `docs/ARCHITECTURE.md` (sección ADRs).

## 3. Estándares de arquitectura
- La UI (pages/components) no debe acceder directamente a `db.ts`.
- Todo acceso a datos desde UI/hooks debe pasar por repositorios en `src/repositories`.
- Los hooks de aplicación concentran orquestación y lógica de casos de uso.
- Operaciones compuestas deben ejecutarse en métodos atómicos de `GymDatabase`.

## 4. Convenciones de repositorios
Usar verbos explícitos por intención:
- Lectura de colecciones: `list*`
- Lectura específica: `get*By*`
- Creación: `create*`
- Actualización: `update*`
- Eliminación: `delete*`
- Escritura idempotente: `upsert*`

## 5. Gestión de deuda técnica

### 5.1 Qué consideramos deuda técnica
- Lógica de negocio en componentes de UI.
- Dependencias cruzadas no justificadas entre capas.
- Falta de test en módulos críticos.
- Código duplicado con riesgo de divergencia.

### 5.2 Política de control
- Cada PR debe declarar si introduce deuda técnica.
- Si introduce deuda, debe incluir:
  - Justificación.
  - Riesgo asociado.
  - Plan y fecha objetivo de resolución.
- Preferir reducción continua de deuda en refactors adyacentes.

### 5.3 Plantilla breve de registro
- **ID**: TD-XXX
- **Descripción**
- **Impacto** (bajo/medio/alto)
- **Módulo afectado**
- **Plan de mitigación**
- **Fecha objetivo**

## 6. Reglas de linting
El proyecto usa ESLint con:
- `@eslint/js` (base JS)
- `typescript-eslint` (TS)
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`

Principios prácticos:
- No ignorar reglas sin justificación explícita.
- Mantener hooks con dependencias correctas.
- Evitar patrones inseguros de tipado cuando exista alternativa fuerte.

## 7. Estrategia de testing

### 7.1 Unit testing (Vitest)
Objetivo: proteger lógica pura y reglas de dominio.
- Prioridad: utilidades (`utils/*`), cálculos, transformaciones y lógica de repositorio/hook desacoplada.
- Herramientas: `vitest`, `jsdom`, `tests/setup.ts`.

### 7.2 Component testing
Objetivo: validar contratos de UI y comportamiento visible.
- Prioridad: componentes críticos de entrenamiento, formularios y estados de error/carga.
- Herramientas: Testing Library (`@testing-library/react`, `@testing-library/jest-dom`).

### 7.3 Cobertura mínima sugerida
- Cambios de lógica: incluir pruebas nuevas o actualizar las existentes.
- Cambios de UI crítica: al menos un test de render/interacción.

## 8. Checklist de Pull Request
- [ ] Sin acceso directo a `db.ts` desde UI nueva/modificada.
- [ ] Nombres de repositorio alineados con convención (`list/get/create/update/delete/upsert`).
- [ ] `npm run lint` sin errores.
- [ ] `npm run build` exitoso.
- [ ] Tests agregados/actualizados cuando aplica.
- [ ] Documentación actualizada si cambió arquitectura o decisiones de diseño.

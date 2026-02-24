# Setup y Dependencias

## 1) Requisitos

- Node.js 20+
- npm 10+
- Navegador moderno con IndexedDB

## 2) Instalación

```bash
npm install
npm run dev
```

## 3) Scripts actuales

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## 4) Dependencias opcionales por fase

### Fase Rutina Builder (drag and drop)

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Fase analítica de fechas

```bash
npm install date-fns
```

### Fase exportación PDF

```bash
npm install jspdf jspdf-autotable
```

### Fase PWA

```bash
npm install -D vite-plugin-pwa
npm install workbox-window
```

### Fase testing

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

## 5) Configuraciones sugeridas (incrementales)

### Alias de import (`@/`)

Agregar alias en `vite.config.ts` y `tsconfig.app.json` antes de refactors de paths masivos.

### PWA

Integrar `VitePWA` en `vite.config.ts` cuando se cierre MVP funcional, para evitar ruido de debugging durante desarrollo temprano.

### Testing

Añadir `vitest.config.ts` + `tests/setup.ts` al iniciar cobertura de utilidades y hooks.

## 6) Política de upgrades

- Mantener librerías actuales (React 19/Vite 7)
- Evitar downgrade para encajar plantillas antiguas
- Agregar paquetes solo cuando la fase los use

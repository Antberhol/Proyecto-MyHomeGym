# Setup and Dependencies

## 1) Requirements

- Node.js 20+
- npm 10+
- Modern browser with IndexedDB support

## 2) Installation

```bash
npm install
npm run dev
```

## 3) Current scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## 4) Optional dependencies by phase

### Routine Builder phase (drag and drop)

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Date analytics phase

```bash
npm install date-fns
```

### PDF export phase

```bash
npm install jspdf jspdf-autotable
```

### PWA phase

```bash
npm install -D vite-plugin-pwa
npm install workbox-window
```

### Testing phase

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

## 5) Suggested configurations (incremental)

### Import alias (`@/`)

Add aliases in `vite.config.ts` and `tsconfig.app.json` before large path refactors.

### PWA

Integrate `VitePWA` in `vite.config.ts` once the functional MVP is stable, to avoid debugging noise during early development.

### Testing

Add `vitest.config.ts` + `tests/setup.ts` when starting utility and hook coverage.

## 6) Upgrade policy

- Keep current core libraries (React 19/Vite 7)
- Avoid downgrades to match outdated templates
- Add packages only when the phase actually uses them

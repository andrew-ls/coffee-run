# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev             # Start dev server with HMR
npm run build           # Type-check then bundle (tsc -b && vite build)
npm run lint            # Run ESLint
npm run preview         # Preview production build locally
npm run test            # Run tests in watch mode
npm run test:run        # Run tests once (CI)
npm run test:coverage   # Run tests with coverage report
```

## Architecture

Single-page React 19 + TypeScript app built with Vite. No router — navigation is handled by a `Screen` discriminated union in `App.tsx` with `useState`:

```typescript
type Screen =
  | { name: 'run' }
  | { name: 'add' }
  | { name: 'form'; orderId?: string; prefill?: Partial<OrderFormData> }
```

### State & Persistence

All state lives in `localStorage` via the `useLocalStorage` hook (`src/hooks/useLocalStorage.ts`), which syncs across tabs via the `storage` event. The three storage keys are:

- `CoffeeRun:runs` — active and archived runs
- `CoffeeRun:orders` — all orders across all runs
- `CoffeeRun:saved-orders` — user's saved "usual" orders

The three domain hooks (`useRun`, `useOrders`, `useSavedOrders`) each own one of these keys and expose CRUD operations. `useUserId` currently returns a hardcoded `'default-user'` string — it's a placeholder for future multi-user support.

### Layout & Responsiveness

`useBreakpoint` watches a `(min-width: 768px)` media query and returns `'mobile'` or `'desktop'`. `App.tsx` uses this to switch between:

- **Mobile**: `SinglePanelLayout` — one screen at a time, navigated by setting `screen` state
- **Desktop**: `DualPanelLayout` — fixed sidebar (run view) + dynamic right panel (add/form)

### Component Hierarchy

Components follow Atomic Design under `src/components/`:

- `atoms/` — Button, Input, Select, Checkbox, Badge, IconButton, DragHandle, SortableList
- `molecules/` — FormField, OrderCard, SavedOrderCard, ConfirmDialog
- `organisms/` — OrderForm, OrderList, RunHeader, SavedOrderList, Mascot
- `templates/` — SinglePanelLayout, DualPanelLayout

Pages (`src/pages/`) compose organisms: `RunView`, `AddOrder`, `OrderFormPage`.

### Drink Configuration

`src/config/drinks.ts` defines the `DRINKS` array of `DrinkConfig` objects. Each config specifies which form fields (iced, milk, sweetener, etc.) are shown for that drink type. The `OrderForm` organism reads this config to conditionally render fields.

### Internationalisation

i18next + react-i18next, configured in `src/i18n/index.ts` (imported in `src/main.tsx` before `App`). Single `en-GB` locale at `src/i18n/locales/en-GB.json`. All UI text must use `useTranslation()` → `t(...)`. Config enum values (drink types, milk, sweetener) are stored in English in state/storage and translated at render time.

### Styling

- CSS Modules with `camelCaseOnly` class name convention (configured in `vite.config.ts`)
- Design tokens defined as CSS custom properties in `src/styles/tokens.css` (colors, spacing, typography, shadows, transitions)
- `@` path alias resolves to `src/`

### Testing

Vitest with jsdom + `@testing-library/react`. Coverage thresholds: 100% statements, 100% branches, 100% functions, 100% lines.

- `src/test/setup.ts` — mocks `window.matchMedia`, `crypto.randomUUID`, clears localStorage before each test, initialises i18n
- `src/test/fixtures.ts` — factory functions (`createRun`, `createOrder`, `createSavedOrder`, `createOrderFormData`) that accept partial overrides

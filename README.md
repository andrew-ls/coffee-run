# Coffee Run

A client-side React app for managing group coffee orders in an office setting. Start a run, collect drink orders from colleagues, and track them in a checklist — all without a backend.

<!-- TODO: Add screenshot or GIF demo here -->
<!-- ![Coffee Run screenshot](docs/screenshot.png) -->

## Features

- **Drink orders** — add orders with configurable options: drink type, variant, iced, milk type/amount, sweetener type/amount, and notes
- **Saved orders** — bookmark someone's usual drink and recall it with one tap, or use it as a starting point for a custom order
- **Drag-and-drop reordering** — rearrange orders and saved orders by dragging
- **Swipe-to-delete** — remove orders with a swipe gesture on mobile
- **Run lifecycle** — start a run, collect orders, end and archive it
- **Responsive layout** — single-panel on mobile with page transitions, dual-panel sidebar on desktop
- **Offline-first** — all data stored in localStorage, no server required

## Tech stack

React 19, TypeScript, Vite, CSS Modules, i18next (en-GB), @dnd-kit, Vitest + Testing Library.

No backend, no router — navigation is a screen state machine and all state lives in the browser.

## Getting started

**Prerequisites:** Node 20+

```bash
git clone <repo-url>
cd coffee-run
npm install
npm run dev
```

The dev server starts at `http://localhost:5173` with hot module replacement.

To build for production:

```bash
npm run build
npm run preview
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) then bundle (`vite build`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage report |

## Project structure

```
src/
  App.tsx            # Screen state machine, responsive layout switching
  components/        # Atomic Design: atoms/ molecules/ organisms/ templates/
  pages/             # Screen-level components (RunView, AddOrder, OrderFormPage)
  hooks/             # Data and UI hooks (useRun, useOrders, useSavedOrders, etc.)
  config/            # Data-driven drink, milk, and sweetener configuration
  types/             # Domain type definitions
  styles/            # CSS custom properties (design tokens) and global styles
  i18n/              # i18next setup and en-GB locale strings
  test/              # Test setup, mocks, and fixture factories
```

## Documentation

See [SPEC.product.md](SPEC.product.md) for the full product specification, and [SPEC.technical.md](SPEC.technical.md) for architecture and technical details.

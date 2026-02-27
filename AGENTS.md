# Coffee Run

React SPA for managing group coffee orders — no backend, no router, all state in localStorage.

## Stack

- TypeScript / Node 20, Vite 7
- React 19, CSS Modules (camelCaseOnly), @dnd-kit/sortable
- i18next + react-i18next, single en-GB locale
- Vitest 4, @testing-library/react, jsdom

## Project structure

```
src/
  App.tsx            # Screen state machine (no router), layout switching
  components/        # atoms/ molecules/ organisms/ templates/
  contexts/          # SidebarContext (panel visibility on mobile)
  pages/             # RunView, AddOrder, OrderFormPage, LandingPage
  hooks/             # useRun, useOrders, useSavedOrders, useLocalStorage, useBreakpoint, useUserId, useSwipeToDelete
  config/            # DrinkConfig[], milk/sweetener arrays, aspect pill colours
  i18n/              # i18n config + locales/en-GB.json
  styles/            # tokens.css (CSS custom properties), global.css
  test/              # setup.ts (mocks + fixtures), fixtures.ts (factories)
  types/             # domain type definitions
  utils/             # generateId, now (timestamps)
agent_docs/          # Claude-specific reference docs (see below)
```

## Commands

```bash
npm run dev             # Start dev server with HMR
npm run build           # Type-check then bundle (tsc -b && vite build)
npm run lint            # Run ESLint
npm run test            # Run tests in watch mode
npm run test:run        # Run tests once (CI)
npm run test:coverage   # Run tests with coverage report
```

### Running a single test

```bash
npx vitest run src/components/atoms/Button/Button.test.tsx
```

### Path alias

`@` resolves to `src/` in all imports and in Vitest. Use `@/components/atoms` not `../../components/atoms`.

## Architecture

- **No router.** Screen navigation is a discriminated union (`Screen`) in `App.tsx` `useState`. Pages receive handler callbacks; only `App.tsx` calls `setScreen`.
- **Three localStorage keys** with clear hook ownership: `CoffeeRun:runs` (useRun), `CoffeeRun:orders` (useOrders), `CoffeeRun:savedOrders` (useSavedOrders). `useLocalStorage` syncs across browser tabs via the `storage` event.
- **Drink config drives the form.** Each `DrinkConfig` in `src/config/drinks.ts` has a `fields` object that toggles which form sections render. Adding a new drink = add to the `DRINKS` array + add translations to `en-GB.json`.
- **Enum values stored raw.** Drink types, milk types, sweetener types are stored as English strings in localStorage. Translation happens at display time using i18n keys like `drinks.${type}`, `milkTypes.${type}`.
- **Layout breakpoint at 768px.** `useBreakpoint` switches between single-panel mobile (with sidebar toggle) and dual-panel desktop.

## TypeScript

Strict mode is on with `noUnusedLocals` and `noUnusedParameters`. Target ES2022.

## Test coverage thresholds

80% statements, 75% branches, 85% functions. Excluded: `main.tsx`, `i18n/index.ts`, `styles/**`, `test/**`, barrel exports (`index.ts`), `types/**`.

## Workflow

- Read the relevant `agent_docs/` file before starting work (see below).
- Run `npm run test:run` and `npm run lint` before considering any task complete.
- Prefer extending existing patterns over introducing new abstractions.
- Do not mark work complete if tests or lint fail.
- When a change affects product behaviour, screens, drink config, visual design, or copy, update `SPEC.product.md` to match.
- When a change affects project structure, data model, types, hooks, components, config, styling tokens, i18n setup, testing, or build config, update `SPEC.technical.md` to match.
- When a change affects the app's features, tech stack, prerequisites, npm scripts, or top-level project structure, update `README.md` to match.

## Context management

- Ignore: `node_modules/`, `dist/`, `coverage/`
- Use subagents for codebase exploration to keep main context clean.

## Reference docs

Read the relevant file from `agent_docs/` before starting work:

- `agent_docs/architecture.md` — Screen state machine, localStorage, layout switching
- `agent_docs/components.md` — Atomic Design hierarchy, co-location conventions
- `agent_docs/patterns.md` — i18n rules, drink config, styling conventions
- `agent_docs/testing.md` — Test setup, fixtures, coverage config

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
  pages/             # RunView, AddOrder, OrderFormPage
  hooks/             # useRun, useOrders, useSavedOrders, useLocalStorage, useBreakpoint
  config/drinks.ts   # DrinkConfig array — drives conditional form fields
  i18n/              # i18n config + locales/en-GB.json
  styles/            # tokens.css (CSS custom properties), global.css
  test/              # setup.ts (mocks + fixtures), fixtures.ts (factories)
  types/             # domain type definitions
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

## Workflow

- Read the relevant `agent_docs/` file before starting work (see below).
- Run `npm run test:run` and `npm run lint` before considering any task complete.
- Prefer extending existing patterns over introducing new abstractions.
- Do not mark work complete if tests or lint fail.
- When a change affects product behaviour, screens, drink config, visual design, or copy, update `SPEC.product.md` to match.
- When a change affects project structure, data model, types, hooks, components, config, styling tokens, i18n setup, testing, or build config, update `SPEC.technical.md` to match.

## Context management

- Ignore: `node_modules/`, `dist/`, `coverage/`
- Use subagents for codebase exploration to keep main context clean.

## Reference docs

Read the relevant file from `agent_docs/` before starting work:

- `agent_docs/architecture.md` — Screen state machine, localStorage, layout switching
- `agent_docs/components.md` — Atomic Design hierarchy, co-location conventions
- `agent_docs/patterns.md` — i18n rules, drink config, styling conventions
- `agent_docs/testing.md` — Test setup, fixtures, coverage config

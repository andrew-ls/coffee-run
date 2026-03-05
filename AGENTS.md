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
  app/               # App.tsx (screen state machine), contexts/, main.tsx, styles/
  entities/          # active-order/, run/, saved-order/ — domain model + entity UI
  pages/             # add-order/, landing-page/, order-form-page/, run-view/
  shared/            # assets/, config/, hooks/, i18n/, types/, ui/, utils/
  widgets/           # layout/, mascot/, order-form/, run-header/
  test/              # setup.ts (mocks), fixtures.ts (factories)
agent_docs/          # Claude-specific reference docs (see below)
```

**FSD layer rules:** `shared` ← `entities` ← `widgets` ← `pages` ← `app`. Upper layers may import from lower layers; lower layers must not import from upper layers.

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
npx vitest run src/shared/ui/Button/Button.test.tsx
```

### Path alias

`@` resolves to `src/` in all imports and in Vitest. Use `@/shared/ui/Button` not `../../shared/ui/Button`.

## Architecture

- **No router.** Screen navigation is a discriminated union (`Screen`) in `App.tsx` `useState`. Pages receive handler callbacks; only `App.tsx` calls `setScreen`.
- **Three localStorage keys** with clear hook ownership: `CoffeeRun:runs` (useRun in `entities/run`), `CoffeeRun:orders` (useActiveOrders in `entities/active-order`), `CoffeeRun:savedOrders` (useSavedOrders in `entities/saved-order`). `useLocalStorage` syncs across browser tabs via the `storage` event.
- **Drink config drives the form.** Each `DrinkConfig` in `src/shared/config/drinks.ts` has a `fields` object that toggles which form sections render. Adding a new drink = add to the `DRINKS` array + add translations to `en-GB.json`.
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
- When a change affects product behaviour, screens, drink config, or copy, update `agent_docs/product.md` to match.
- When a change adds, removes, or significantly alters a user-facing feature or workflow (e.g. new screens, new gestures, changes to the run/order lifecycle), review and update the help tips in `src/pages/landing-page/LandingPage.tsx` and their translation keys in `src/shared/i18n/locales/en-GB.json` (`landingPage.*`) to keep the onboarding guidance accurate.
- When a change affects visual design or design tokens, update `agent_docs/styling.md` to match.
- When a change affects the data model, types, hook APIs, or key implementation details, update `agent_docs/data-model.md` to match.
- When a change affects component structure or descriptions, update `agent_docs/components.md` to match.
- When a change affects i18n setup, drink config fields, interaction patterns, or DnD/swipe behaviour, update `agent_docs/patterns.md` to match.
- When a change affects screen navigation, state machine transitions, or layout, update `agent_docs/architecture.md` to match.
- When a change affects test setup, fixtures, or coverage config, update `agent_docs/testing.md` to match.
- When a change affects the app's features, tech stack, prerequisites, npm scripts, or top-level project structure, update `README.md` to match.

## Context management

- Ignore: `node_modules/`, `dist/`, `coverage/`
- Use subagents for codebase exploration to keep main context clean.

## Reference docs

Read the relevant file from `agent_docs/` before starting work:

- `agent_docs/architecture.md` — Screen state machine, transitions, localStorage, layout switching
- `agent_docs/components.md` — FSD layer structure, component descriptions, co-location conventions
- `agent_docs/data-model.md` — Data model interfaces, hook APIs, key implementation details
- `agent_docs/patterns.md` — i18n rules, drink config, DnD & swipe patterns
- `agent_docs/product.md` — App overview, screens & workflow, copy & tone, planned features, known issues
- `agent_docs/styling.md` — Visual design, design tokens, CSS conventions
- `agent_docs/testing.md` — Test setup, fixtures, coverage config

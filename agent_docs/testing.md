# Testing

## Stack

Vitest 4 + jsdom + `@testing-library/react`. Test files are co-located with the source file they test (`Foo.test.tsx` next to `Foo.tsx`).

## Setup (`src/test/setup.ts`)

Runs before every test file via `setupFiles` in `vitest.config.ts`. It:

- Mocks `window.matchMedia` (jsdom does not implement it)
- Mocks `crypto.randomUUID` to return `'test-uuid-' + random suffix`
- Re-applies both mocks in `beforeEach` (needed because `vi.clearAllMocks()` clears them)
- Calls `localStorage.clear()` and `vi.clearAllMocks()` before each test
- Calls `cleanup()` after each test to unmount React trees

Import `@testing-library/jest-dom/vitest` matchers are available globally (e.g. `toBeInTheDocument()`).

## Fixtures (`src/test/fixtures.ts`)

Factory functions for domain types; all accept `Partial<T>` overrides:

| Factory | Default values |
|---------|---------------|
| `createRun(overrides?)` | `id: 'run-1'`, `userId: 'default-user'`, `archivedAt: null` |
| `createOrder(overrides?)` | `id: 'order-1'`, `runId: 'run-1'`, Coffee Latte with Oat milk |
| `createOrderFormData(overrides?)` | Same drink defaults as `createOrder` without id/runId/timestamps |
| `createSavedOrder(overrides?)` | `id: 'saved-1'`, wraps `createOrderFormData()` |

## CSS Modules in tests

`vitest.config.ts` sets `css.modules.classNameStrategy: 'non-scoped'`, so class names in tests match the original unscoped name (e.g. `wrapper` not `wrapper_abc123`). Query by role or label rather than class name where possible.

## Coverage configuration

Provider: v8. Reporters: `text` (console), `html` (coverage/).

**Included**: `src/**/*.{ts,tsx}`

**Excluded from coverage**:
- `src/main.tsx`
- `src/i18n/index.ts`
- `src/styles/**`
- `src/test/**`
- `src/**/index.ts` (barrel files)
- `src/types/**`

**Thresholds** (from `vitest.config.ts`):
- Statements: 80%
- Branches: 75%
- Functions: 85%

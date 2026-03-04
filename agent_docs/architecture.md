# Architecture

## Navigation — Screen state machine

There is no router. Navigation is a `Screen` discriminated union held in `useState` in `App.tsx`:

```typescript
type Screen =
  | { name: 'landing' }
  | { name: 'add' }
  | { name: 'form'; orderId?: string; prefill?: Partial<OrderFormData> }

type Direction = 'forward' | 'back'
```

`App.tsx` passes handler callbacks (e.g. `handleAddOrder`, `handleEditOrder`) down to pages as props. Pages never set screen state directly — they call the handler they were given. There is no global state manager.

`direction` drives the `PageTransition` molecule, which wraps the main content area. Forward navigations (landing→add, add→form) slide the incoming screen in from below; back navigations slide in from above. Both the outgoing and incoming pages are simultaneously in the DOM for the 250ms transition.

**Screen transitions:**

| Event | screen | sidebarActive | direction |
|-------|--------|---------------|-----------|
| App start, no Run | `landing` | `true` | — |
| User starts a Run | `add` | `true` (sidebar stays) | `forward` |
| FAB tap (mobile) | `add` | `false` (main shows) | `forward` |
| "New Order" tap | `form` (no orderId/prefill) | unchanged | `forward` |
| "Custom" on Saved Order | `form` (with prefill) | unchanged | `forward` |
| "Edit" on Order card | `form` (orderId + prefill) | `false` on mobile | `forward` |
| Form submit | `add` | `true` on mobile | `back` |
| "Cancel" in form | `add` | unchanged | `back` |
| "Back" tap (mobile) | unchanged | `true` | `back` |
| "Usual" on Saved Order | unchanged | `true` | `back` |
| End Run confirmed | `landing` | `true` | `back` |

## State & persistence

All state lives in `localStorage`. The `useLocalStorage<T>` hook (`src/shared/hooks/useLocalStorage.ts`) handles serialisation and listens to the `storage` event to sync state across browser tabs.

Three storage keys, each owned exclusively by one domain hook:

| Key | Hook | Contents |
|-----|------|----------|
| `CoffeeRun:runs` | `useRun` | Active and archived runs |
| `CoffeeRun:orders` | `useOrders` | All orders across all runs |
| `CoffeeRun:savedOrders` | `useSavedOrders` | User's saved "usual" orders |

Each domain hook exposes CRUD operations. Nothing else reads or writes these keys directly.

`useUserId` returns the hardcoded string `'default-user'`. It is a placeholder — the hook exists so a future multi-user implementation has a clear seam to change.

## Layout & responsiveness

`useBreakpoint` watches `(min-width: 768px)` and returns `'mobile'` or `'desktop'`.

`App.tsx` uses a single `DualPanelLayout` template on all form factors. Both panels (sidebar and main) are always in the DOM. Panel visibility on mobile is controlled by `SidebarContext`:

- **`SidebarContext`** (`src/contexts/SidebarContext.tsx`) provides `sidebarActive` (boolean) and `setSidebarActive`. Created in `App.tsx` and consumed by `DualPanelLayout`.
- **Mobile**: `DualPanelLayout` applies CSS transform classes (`sidebarHidden` / `mainHidden`) to show one panel at a time based on `sidebarActive`.
- **Desktop**: Both panels are always fully visible; `sidebarActive` has no visual effect.

Navigation actions live in `BottomAppBar` organisms rendered via `DualPanelLayout`'s `sidebarBottom` and `mainBottom` slots. `App.tsx` assembles the bar content — pages do not contain their own navigation controls.

- **Sidebar bar**: "End Run" button (left), FAB (right, shown on mobile or when on landing screen).
- **Main bar** (contextual): Cancel + Submit on the form screen; Back button on add/landing (mobile only).

## Landing screen — onboarding tips

`LandingPage` (`src/pages/LandingPage.tsx`) shows a three-step walkthrough and feature tips explaining how to use the app. Content is driven entirely by `landingPage.*` keys in `src/i18n/locales/en-GB.json`.

**Desktop**: The tips render in the main panel alongside the visible sidebar. Step 1 includes a dashed SVG arrow pointing left toward the "Start a new Run" button in the sidebar. Steps 2–3 show inline SVG illustrations of the FAB and End Run button, since those elements are not present on the landing screen.

**Mobile**: On the landing screen the sidebar is shown by default (`sidebarActive: true`), so `LandingPage` is off-screen. A "?" icon button in `RunHeader` (hidden on desktop via `@media (min-width: 768px) { display: none }`) is always wired to `handleHelpClick`, which sets `screen` to `'landing'`, sets `sidebarActive` to `false`, and sets the transition direction to `'back'`. This navigates to the tips from any screen on mobile. The existing Back button in the main bar returns to the previous view (`handleBack` → `setSidebarActive(true)` on mobile).

**Keeping tips current**: If a workflow step is added, removed, or renamed, update the step content in `LandingPage.tsx` and the corresponding `landingPage.steps.*` / `landingPage.features.*` keys. See the Workflow section in `AGENTS.md` for the full rule.

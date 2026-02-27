# Architecture

## Navigation — Screen state machine

There is no router. Navigation is a `Screen` discriminated union held in `useState` in `App.tsx`:

```typescript
type Screen =
  | { name: 'landing' }
  | { name: 'add' }
  | { name: 'form'; orderId?: string; prefill?: Partial<OrderFormData> }
```

`App.tsx` passes handler callbacks (e.g. `handleAddOrder`, `handleEditOrder`) down to pages as props. Pages never set screen state directly — they call the handler they were given. There is no global state manager.

## State & persistence

All state lives in `localStorage`. The `useLocalStorage<T>` hook (`src/hooks/useLocalStorage.ts`) handles serialisation and listens to the `storage` event to sync state across browser tabs.

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

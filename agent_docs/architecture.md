# Architecture

## Navigation — Screen state machine

There is no router. Navigation is a `Screen` discriminated union held in `useState` in `App.tsx`:

```typescript
type Screen =
  | { name: 'run' }
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
| `CoffeeRun:saved-orders` | `useSavedOrders` | User's saved "usual" orders |

Each domain hook exposes CRUD operations. Nothing else reads or writes these keys directly.

`useUserId` returns the hardcoded string `'default-user'`. It is a placeholder — the hook exists so a future multi-user implementation has a clear seam to change.

## Layout & responsiveness

`useBreakpoint` watches `(min-width: 768px)` and returns `'mobile'` or `'desktop'`.

`App.tsx` switches layouts based on this value:

- **Mobile** (`SinglePanelLayout`): one `Screen` rendered at a time; navigation changes which screen is shown.
- **Desktop** (`DualPanelLayout`): fixed left sidebar always shows `RunView`; the right panel shows `AddOrder` or `OrderFormPage` based on screen state. The `RunHeader` organism is rendered as the layout's header slot.

On desktop, `RunView` and `AddOrder` receive `showHeader={false}` / `showBack={false}` to suppress elements that only make sense in single-panel navigation.

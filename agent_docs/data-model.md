# Data Model

## Domain Types

### Run

```typescript
interface Run {
  id: string              // crypto.randomUUID()
  userId: string          // From useUserId() — currently 'default-user'
  createdAt: string       // ISO 8601 timestamp
  archivedAt: string | null  // null = active, ISO timestamp = archived
}
```

**Storage key:** `CoffeeRun:runs`
**Lifecycle:** Created by `startRun()`. Archived (not deleted) by `archiveRun(runId)` which sets `archivedAt`. Only one Run per user can have `archivedAt === null` at a time.

### ActiveOrder

```typescript
interface OrderFormData {
  personName: string
  drinkType: string       // Key into DRINKS config
  variant: string         // Selected variant or 'Other'
  customVariant: string   // Freetext when variant === 'Other'
  iced: boolean
  milkType: MilkType      // 'Regular' | 'Semi-Skimmed' | ... | 'None'
  milkAmount: MilkAmount  // 'Splish' | 'Splash' | 'Splosh'
  sweetenerType: SweetenerType  // 'Sugar' | 'Brown Sugar' | ... | 'None'
  sweetenerAmount: number // 0–5, step 0.5
  customDrinkName: string // Freetext when drinkType === 'Other'
  notes: string
}

interface ActiveOrder extends OrderFormData {
  id: string
  runId: string           // Foreign key to Run.id
  done: boolean           // Whether the order has been fulfilled
  createdAt: string       // ISO 8601
  updatedAt: string       // ISO 8601
}
```

**Storage key:** `CoffeeRun:orders`
All ActiveOrders across all Runs are stored in a single flat array. Filtering by `runId` happens in `useActiveOrders`.

### SavedOrder

```typescript
interface SavedOrder {
  id: string
  userId: string          // From useUserId()
  orderData: OrderFormData
  createdAt: string
  updatedAt: string
}
```

**Storage key:** `CoffeeRun:savedOrders`

### Derived Types

```typescript
type MilkType = (typeof MILK_TYPES)[number]    // Union of milk type string literals
type MilkAmount = (typeof MILK_AMOUNTS)[number] // 'Splish' | 'Splash' | 'Splosh'
type SweetenerType = (typeof SWEETENER_TYPES)[number]
```

## Drink Configuration Type

Defined in `src/shared/config/drinks.ts` as a `readonly DrinkConfig[]`. See `agent_docs/patterns.md` for the full `DrinkConfig` interface and the feature matrix.

## Hooks (Data Layer)

All persistence is abstracted through custom hooks. Components never call localStorage directly.

### `useLocalStorage<T>(key, initialValue)`

Generic hook wrapping localStorage (`src/shared/hooks/useLocalStorage.ts`).

- Lazy initialisation from stored JSON.
- Functional updates (`setValue(prev => ...)`).
- Cross-tab sync via the `storage` event.

### `useUserId(): string`

Returns `'default-user'`. Placeholder for future auth — when auth is added, only this hook changes.

### `useRun()`

In `src/entities/run`. Returns `{ activeRun, startRun, archiveRun }`.

- `activeRun`: The current user's non-archived Run, or `null`.
- `startRun()`: Creates and persists a new Run.
- `archiveRun(runId)`: Sets `archivedAt` on the Run.

### `useActiveOrders(runId: string | null)`

In `src/entities/active-order`. Returns `{ orders, addOrder, updateOrder, removeOrder, toggleDone, reorderOrders }`.

- Filters the global ActiveOrder array by `runId`.
- `addOrder(data: OrderFormData)`: Creates an ActiveOrder with `done: false`, generated ID, and timestamps.
- `updateOrder(orderId, data)`: Partial update with new `updatedAt`.
- `removeOrder(orderId)`: Hard deletes from the array.
- `toggleDone(orderId)`: Flips the `done` boolean and updates `updatedAt`.
- `reorderOrders(reordered: ActiveOrder[])`: Replaces this run's orders with the provided reordered array, preserving other runs' orders.

### `useSavedOrders()`

In `src/entities/saved-order`. Returns `{ savedOrders, saveOrder, removeSavedOrder, reorderSavedOrders }`.

- Filters by current `userId`.
- `saveOrder(data)`: Always creates a new SavedOrder (no update/overwrite — see Known Issues in `agent_docs/product.md`).
- `removeSavedOrder(savedId)`: Hard deletes.
- `reorderSavedOrders(reordered: SavedOrder[])`: Replaces this user's saved orders with the provided reordered array.

### `useBreakpoint(): 'mobile' | 'desktop'`

Uses `window.matchMedia('(min-width: 768px)')` with a change listener. Returns the current breakpoint.

### `useSwipe(options?)`

In `src/shared/ui/ActionCard/useSwipe.ts`. Handles touch swipe gestures for `ActionCard`. Options: `enableRightSwipe` (boolean), `snapLeftRef` and `snapRightRef` (element refs for snap width measurement). Returns `{ swipeStyle, swipeDirection, touchHandlers }`. Only active on touch devices (pointer: coarse). Swipe threshold: 80px.

### `useConfirmation(onConfirm)`

In `src/shared/hooks/useConfirmation.ts`. Manages the state for a confirmation dialog. Returns `{ pendingId, request, confirm, cancel }`. Call `request(id)` to open the dialog; `confirm()` calls `onConfirm(id)` and clears state; `cancel()` clears state without calling.

## Key Implementation Details

### ID Generation

`crypto.randomUUID()` via `src/shared/utils/id.ts`. Mocked in tests to return `'test-uuid-' + random`.

### Timestamp Generation

`new Date().toISOString()` via `src/shared/utils/time.ts`.

### localStorage Key Namespace

All keys prefixed with `CoffeeRun:` — `CoffeeRun:runs`, `CoffeeRun:orders`, `CoffeeRun:savedOrders`.

### App Name

Single source of truth: the `app.name` key in the i18n locale (`'Coffee Run'`). Never hardcoded in components.

### Order Reordering

`arrayMove` from `@dnd-kit/sortable`. The reorder functions in `useActiveOrders` and `useSavedOrders` take the complete reordered subset and splice it back into the flat global array, preserving positions of other runs'/users' records.

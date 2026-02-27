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

### Order

```typescript
interface Order {
  id: string
  runId: string           // Foreign key to Run.id
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
  createdAt: string       // ISO 8601
  updatedAt: string       // ISO 8601
}

type OrderFormData = Omit<Order, 'id' | 'runId' | 'createdAt' | 'updatedAt'>
```

**Storage key:** `CoffeeRun:orders`
All Orders across all Runs are stored in a single flat array. Filtering by `runId` happens in `useOrders`.

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

Defined in `src/config/drinks.ts` as a `readonly DrinkConfig[]`. See `agent_docs/patterns.md` for the full `DrinkConfig` interface and the feature matrix.

## Hooks (Data Layer)

All persistence is abstracted through custom hooks. Components never call localStorage directly.

### `useLocalStorage<T>(key, initialValue)`

Generic hook wrapping localStorage.

- Lazy initialisation from stored JSON.
- Functional updates (`setValue(prev => ...)`).
- Cross-tab sync via the `storage` event.

### `useUserId(): string`

Returns `'default-user'`. Placeholder for future auth — when auth is added, only this hook changes.

### `useRun()`

Returns `{ activeRun, startRun, archiveRun }`.

- `activeRun`: The current user's non-archived Run, or `null`.
- `startRun()`: Creates and persists a new Run.
- `archiveRun(runId)`: Sets `archivedAt` on the Run.

### `useOrders(runId: string | null)`

Returns `{ orders, addOrder, updateOrder, removeOrder, reorderOrders }`.

- Filters the global Order array by `runId`.
- `addOrder(data: OrderFormData)`: Creates an Order with generated ID and timestamps.
- `updateOrder(orderId, data)`: Partial update with new `updatedAt`.
- `removeOrder(orderId)`: Hard deletes from the array.
- `reorderOrders(fromIndex, toIndex)`: Reorders within the Run's subset while preserving global array positions (uses `arrayMove` from @dnd-kit).

### `useSavedOrders()`

Returns `{ savedOrders, saveOrder, removeSavedOrder, reorderSavedOrders }`.

- Filters by current `userId`.
- `saveOrder(data)`: Always creates a new SavedOrder (no update/overwrite — see Known Issues in `agent_docs/product.md`).
- `removeSavedOrder(savedId)`: Hard deletes.
- `reorderSavedOrders(fromIndex, toIndex)`: Same array-reorder pattern as Orders.

### `useBreakpoint(): 'mobile' | 'desktop'`

Uses `window.matchMedia('(min-width: 768px)')` with a change listener. Returns the current breakpoint.

### `useSwipeToDelete(options?)`

Touch gesture handler for swipe-to-delete. Options: `enableRightSwipe` (boolean), `snapLeftRef` and `snapRightRef` (element refs for snap width measurement). Returns touch event handlers and swipe state. Only active on mobile. Swipe threshold: 80px.

## Key Implementation Details

### ID Generation

`crypto.randomUUID()` via `src/utils/id.ts`. Mocked in tests to return `'test-uuid-' + random`.

### Timestamp Generation

`new Date().toISOString()` via `src/utils/time.ts`.

### localStorage Key Namespace

All keys prefixed with `CoffeeRun:` — `CoffeeRun:runs`, `CoffeeRun:orders`, `CoffeeRun:savedOrders`.

### App Name

Single source of truth: the `app.name` key in the i18n locale (`'Coffee Run'`). Never hardcoded in components.

### Order Reordering

`arrayMove` from `@dnd-kit/sortable`. The reorder functions in `useOrders` and `useSavedOrders` operate on a filtered subset (by `runId` or `userId`) while preserving all other entries' positions in the flat array.

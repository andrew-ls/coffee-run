# Coffee Run — Technical Specification

## Stack

| Concern | Technology | Version |
|---------|-----------|---------|
| Language | TypeScript (strict mode) | 5.9 |
| Runtime | Node.js | 20 |
| UI Framework | React | 19 |
| Build Tool | Vite | 7 |
| Styling | CSS Modules (camelCaseOnly) | — |
| Internationalisation | i18next + react-i18next | 25.x / 16.x |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable | 6.x / 10.x |
| Testing | Vitest + @testing-library/react | 4.x / 16.x |
| Test Environment | jsdom | 28.x |

No backend. No router. No state management library — React hooks + localStorage only.

---

## Project Structure

```
src/
├── App.tsx                  # Screen state machine, layout switching
├── App.module.css           # Mobile slide-in transition
├── main.tsx                 # React root, global CSS + i18n init
├── config/                  # Data-driven configuration
│   ├── app.ts               # APP_NAME constant
│   ├── drinks.ts            # DrinkConfig[] — drives conditional form fields
│   ├── milk.ts              # MILK_TYPES, MILK_AMOUNTS arrays
│   ├── sweetener.ts         # SWEETENER_TYPES, min/max/step
│   ├── aspectColors.ts      # Pill colour mapping by category
│   └── index.ts             # Re-exports all config
├── types/                   # Domain type definitions
│   ├── drink.ts             # MilkType, MilkAmount, SweetenerType
│   ├── order.ts             # Order, OrderFormData
│   ├── run.ts               # Run
│   ├── saved-order.ts       # SavedOrder
│   ├── css-modules.d.ts     # CSS Modules type declaration
│   └── index.ts             # Re-exports all types
├── hooks/                   # Data layer abstraction
│   ├── useLocalStorage.ts   # Generic localStorage hook with cross-tab sync
│   ├── useUserId.ts         # Returns hardcoded 'default-user'
│   ├── useRun.ts            # Active run management + archival
│   ├── useOrders.ts         # CRUD + reorder for Orders in a Run
│   ├── useSavedOrders.ts    # CRUD + reorder for Saved Orders
│   ├── useBreakpoint.ts     # Responsive breakpoint detection
│   ├── useSwipeToDelete.ts  # Shared swipe-to-delete state + touch handlers
│   └── index.ts             # Re-exports all hooks
├── utils/                   # Pure utility functions
│   ├── id.ts                # generateId() — crypto.randomUUID()
│   ├── time.ts              # now() — ISO timestamp
│   └── index.ts             # Re-exports
├── components/              # Atomic Design hierarchy
│   ├── atoms/               # Button, Input, Select, Checkbox, IconButton, Badge, AspectPill, DragHandle, SortableList
│   ├── molecules/           # FormField, ConfirmDialog, OrderCard, SavedOrderCard, DrinkPills
│   ├── organisms/           # RunHeader, OrderForm, OrderList, SavedOrderList, Mascot
│   └── templates/           # SinglePanelLayout, DualPanelLayout
├── pages/                   # Screen-level components
│   ├── RunView.tsx          # Main Run screen
│   ├── AddOrder.tsx         # Add Order / Saved Orders screen
│   └── OrderFormPage.tsx    # Order form wrapper
├── styles/                  # Global styles
│   ├── tokens.css           # CSS custom properties (design tokens)
│   ├── textures.css         # SVG noise texture overlay
│   └── global.css           # Reset + base styles (imports tokens + textures)
├── i18n/                    # Internationalisation
│   ├── index.ts             # i18next init (en-GB, no escaping)
│   └── locales/
│       └── en-GB.json       # All user-facing strings
└── test/                    # Test infrastructure
    ├── setup.ts             # Mocks (matchMedia, crypto.randomUUID), cleanup
    └── fixtures.ts          # Factory functions: createRun, createOrder, createOrderFormData, createSavedOrder
```

---

## Data Model

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
**Note:** All Orders across all Runs are stored in a single flat array. Filtering by `runId` happens in the `useOrders` hook.

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

---

## Drink Configuration

Defined in `src/config/drinks.ts` as a `readonly DrinkConfig[]`:

```typescript
interface DrinkConfig {
  type: string                              // Display name / key
  variants: readonly string[]               // Available variants
  allowOtherVariant: boolean                // Show "Other" freetext option in variants
  allowCustomDrinkName: boolean             // Show freetext drink name (only for 'Other' type)
  pillColor: { background: string; text: string }  // Badge colours
  fields: {
    iced: boolean           // Show iced checkbox
    milk: boolean           // Show milk type select
    milkAmount: boolean     // Show milk amount select (when milk !== 'None')
    sweetener: boolean      // Show sweetener type select
    sweetenerAmount: boolean // Show sweetener amount input (when sweetener !== 'None')
    notes: boolean          // Show notes textarea
  }
}
```

Adding or removing a drink type requires only modifying this array — no component changes needed.

---

## Hooks (Data Layer)

All persistence is abstracted through custom hooks. Components never call localStorage directly.

### `useLocalStorage<T>(key, initialValue)`
Generic hook wrapping localStorage. Supports:
- Lazy initialisation from stored JSON
- Functional updates (`setValue(prev => ...)`)
- Cross-tab synchronisation via the `storage` event

### `useUserId(): string`
Returns `'default-user'`. Placeholder for future auth integration — when auth is added, only this hook changes.

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
- `reorderOrders(fromIndex, toIndex)`: Uses `arrayMove` from @dnd-kit to reorder within the Run's subset while preserving global array positions.

### `useSavedOrders()`
Returns `{ savedOrders, saveOrder, removeSavedOrder, reorderSavedOrders }`.
- Filters by current `userId`.
- `saveOrder(data)`: Always creates a new SavedOrder (no update/overwrite).
- `removeSavedOrder(savedId)`: Hard deletes.
- `reorderSavedOrders(fromIndex, toIndex)`: Same array-reorder pattern as Orders.

### `useBreakpoint(): 'mobile' | 'desktop'`
Uses `window.matchMedia('(min-width: 768px)')` with a change listener. Returns the current breakpoint.

---

## Screen State Machine

`App.tsx` manages navigation via a `Screen` union type:

```typescript
type Screen =
  | { name: 'run' }
  | { name: 'add' }
  | { name: 'form'; orderId?: string; prefill?: Partial<OrderFormData> }
```

**Transitions:**
- `run` → `add`: User taps "Add" FAB
- `add` → `form` (no orderId, no prefill): User taps "New Order"
- `add` → `form` (with prefill): User taps "Custom" on a Saved Order
- `run` → `form` (with orderId + prefill): User taps "Edit" on an Order card
- `form` → `add`: User taps "Cancel"
- `form` → `run`: User submits the form
- `add` → `run`: User taps "Usual" on a Saved Order, or "Back"

On desktop, `run` screen is always visible in the sidebar. The right panel shows `add` or `form`. When no Run is active on desktop, the right panel is empty (`null`).

---

## Component Architecture

### Atoms
Foundational UI primitives. No business logic.

| Component | Description |
|-----------|-------------|
| `Button` | Variants: primary, secondary, danger, ghost, text. Supports `fullWidth`. |
| `Input` | Styled text input wrapping `<input>`. |
| `Select` | Styled `<select>` with custom chevron. Accepts `string` or `{value, label}` options. |
| `Checkbox` | Styled checkbox with label. |
| `IconButton` | Circular icon button. Variants: default, danger. Requires `label` for a11y. |
| `Badge` | Drink type pill with drink-specific colours from config. |
| `AspectPill` | Coloured pill for drink aspects (iced, variant, milk, sweetener). |
| `DragHandle` | Six-dot grip icon for drag-and-drop. |
| `SortableList` | Generic drag-and-drop list using @dnd-kit. Accepts render props for items and overlay. Vertical-axis-only with pointer (8px distance) and touch (250ms delay) sensors. |

### Molecules
Composite components combining atoms.

| Component | Description |
|-----------|-------------|
| `FormField` | Label + children wrapper for form inputs. |
| `ConfirmDialog` | Modal overlay with title, message, cancel/confirm actions. |
| `OrderCard` | Order display card with drag handle, name, drink pills, edit/delete actions, swipe-to-delete. |
| `SavedOrderCard` | Saved Order card with drag handle, name, drink pills, Usual/Custom buttons, swipe-to-delete. |
| `DrinkPills` | Renders a row of Badge + AspectPill components summarising a drink Order. Shared between OrderCard and SavedOrderCard. |

### Organisms
Complex UI blocks with internal state or business logic.

| Component | Description |
|-----------|-------------|
| `RunHeader` | App title, Run status subtitle with Order count. |
| `OrderForm` | Multi-field form driven by drink config. Manages own form state. Resets fields on drink type change. Submit disabled when no drink type selected. |
| `OrderList` | Wraps SortableList with OrderCard rendering. Detects newly added Orders for entry animation. |
| `SavedOrderList` | "Saved Orders" header + SortableList with SavedOrderCard rendering. Shows empty state message. |
| `Mascot` | SVG coffee cup with 3 mood states (neutral/happy/overwhelmed). Wobble animation on mood change. |

### Templates
Layout containers.

| Component | Description |
|-----------|-------------|
| `SinglePanelLayout` | Header + scrollable content area. Used on mobile. |
| `DualPanelLayout` | Fixed-width sidebar (header + scrollable content) + flexible main panel. Used on desktop. |

### Pages
Screen-level components. Compose organisms and pass through callbacks from App.tsx.

| Component | Description |
|-----------|-------------|
| `RunView` | Full Run view: mascot, Order list, bottom bar with End Run + FAB, confirmation dialogs. Handles Run start/end and Order CRUD delegation. |
| `AddOrder` | New Order button + SavedOrderList. Optional back button (mobile). |
| `OrderFormPage` | Wrapper around OrderForm with title (New Order / Edit Order). |

---

## Styling

### Approach
- **CSS Modules** with `camelCaseOnly` convention (configured in Vite).
- **Design tokens** in `src/styles/tokens.css` as CSS custom properties on `:root`.
- **Co-located styles**: Each component has a `.module.css` file alongside it (except where components share a stylesheet, e.g. `Badge` and `AspectPill` share `pill.module.css`).
- **Global reset** in `src/styles/global.css`: box-sizing, margin/padding reset, font inheritance, button reset.
- **Texture overlay** in `src/styles/textures.css`: SVG fractal noise `::before` pseudo-element on `#root`.

### Design Tokens

**Palette:**
- `--color-bg`: `#FDF6EC` (page background)
- `--color-bg-card`: `#FFF9F0` (card/sidebar background)
- `--color-bg-input`: `#FFFCF7` (input field background)
- `--color-primary`: `#6F4E37` (coffee brown — buttons, headings, borders)
- `--color-primary-hover`: `#5A3E2B`
- `--color-primary-light`: `#8B6E55`
- `--color-secondary`: `#D4A574` (caramel accent)
- `--color-accent-pink`: `#E8A0BF`
- `--color-accent-mint`: `#A8D8B9`
- `--color-accent-peach`: `#FBBF77`
- `--color-accent-lavender`: `#C3AED6`
- `--color-danger`: `#D9534F`
- `--color-danger-hover`: `#C9302C`
- `--color-danger-bg`: `#FDE8E8`
- `--color-text`: `#3E2723`
- `--color-text-muted`: `#8D7B6E`
- `--color-border`: `#E0D5C8`
- `--color-border-focus`: `#6F4E37`
- `--color-shadow`: `rgba(111, 78, 55, 0.1)`
- `--color-overlay`: `rgba(62, 39, 35, 0.4)`

**Spacing scale:** `--space-xs` (4px) through `--space-3xl` (48px).

**Typography:**
- Font: `'Nunito', sans-serif` (loaded from Google Fonts: 400, 600, 700, 800)
- Sizes: `--font-size-sm` (0.875rem) through `--font-size-2xl` (2rem)
- Weights: regular (400), semibold (600), bold (700), extrabold (800)

**Borders:** `--radius-sm` (8px), `--radius-md` (12px), `--radius-lg` (16px), `--radius-full` (9999px).

**Shadows:** sm, md, lg — all using `--color-shadow`.

**Transitions:**
- Durations: fast (150ms), normal (250ms), slow (400ms)
- Easings: `--ease-out` (cubic-bezier 0.22, 1, 0.36, 1), `--ease-bounce` (cubic-bezier 0.34, 1.56, 0.64, 1)

**Layout:** `--sidebar-width` (360px), `--header-height` (64px).

---

## Internationalisation

- **Library:** i18next + react-i18next
- **Locale:** Single `en-GB` locale bundled at build time (not lazy-loaded).
- **Config:** Initialised in `src/i18n/index.ts`, imported in `main.tsx`.
- **Interpolation escaping:** Disabled (`escapeValue: false`) since React handles XSS.
- **Pluralisation:** Used for Order count (`orderCount_one` / `orderCount_other`).
- **Translation keys:** Flat namespace under `translation`. All drink types, variants, milk types, sweetener types, and UI strings are keyed.
- **Usage pattern:** `useTranslation()` hook in components, `t('key')` for strings, `t('key', { returnObjects: true })` for arrays (empty state messages).

---

## Testing

### Setup
- **Framework:** Vitest 4 with jsdom environment.
- **Assertion library:** @testing-library/jest-dom matchers (extended via `vitest`).
- **Setup file:** `src/test/setup.ts` — mocks `window.matchMedia`, `crypto.randomUUID`; clears localStorage and mocks before each test; runs Testing Library `cleanup` after each.
- **Fixtures:** `src/test/fixtures.ts` — factory functions `createRun()`, `createOrder()`, `createOrderFormData()`, `createSavedOrder()`, all accepting partial overrides.

### Test Files
Tests are co-located with their source files. Coverage includes:

**Atoms** (7 test files): Button, Checkbox, DragHandle, IconButton, Input, Select, SortableList, AspectPill, Badge
**Molecules** (4 test files): ConfirmDialog, FormField, OrderCard, SavedOrderCard
**Organisms** (5 test files): Mascot, RunHeader, OrderForm, OrderList, SavedOrderList
**Templates** (2 test files): DualPanelLayout, SinglePanelLayout
**Hooks** (6 test files): useBreakpoint, useLocalStorage, useOrders, useRun, useSavedOrders, useUserId
**Utils** (2 test files): id, time
**Config** (1 test file): drinks
**Pages** (3 test files): RunView, AddOrder, OrderFormPage
**Integration** (1 test file): App

### Commands
```bash
npm run test          # Watch mode
npm run test:run      # Single CI run
npm run test:coverage # Coverage report (@vitest/coverage-v8)
```

---

## Build & Development

### Commands
```bash
npm run dev             # Vite dev server with HMR (React Fast Refresh)
npm run build           # tsc -b && vite build (type-check then bundle)
npm run lint            # ESLint
npm run test:run        # Run tests once
```

### Vite Configuration
- **React plugin:** `@vitejs/plugin-react` for Fast Refresh.
- **Path alias:** `@` → `./src` (also configured in tsconfig).
- **CSS Modules:** `localsConvention: 'camelCaseOnly'`.

### TypeScript Configuration
- **Target:** ES2022 (app), ES2023 (node/build tools).
- **Module:** ESNext with bundler module resolution.
- **Strict mode:** Enabled with `noUnusedLocals` and `noUnusedParameters`.
- **JSX:** `react-jsx` transform.
- **Project references:** Root tsconfig references `tsconfig.app.json` and `tsconfig.node.json`.

---

## Key Implementation Details

### ID Generation
`crypto.randomUUID()` via `src/utils/id.ts`. Mocked in tests to return `'test-uuid-' + random`.

### Timestamp Generation
`new Date().toISOString()` via `src/utils/time.ts`.

### LocalStorage Key Namespace
All keys prefixed with `CoffeeRun:` — `CoffeeRun:runs`, `CoffeeRun:orders`, `CoffeeRun:savedOrders`.

### App Name
Single source of truth: `APP_NAME` constant in `src/config/app.ts` (`'Coffee Run'`). Also duplicated in the i18n locale as `app.name` for use in translated contexts.

### Order Reordering
Uses `arrayMove` from `@dnd-kit/sortable`. The reorder functions in `useOrders` and `useSavedOrders` operate on a subset of the global array (filtered by `runId` or `userId`) while preserving positions of all other entries in the flat array.

### Drag & Drop Configuration
- **Sensors:** PointerSensor (8px activation distance), TouchSensor (250ms delay, 5px tolerance).
- **Modifiers:** `restrictToVerticalAxis` — items can only be dragged up/down.
- **Collision detection:** `closestCenter`.
- **Strategy:** `verticalListSortingStrategy`.

### Swipe-to-Delete
Implemented natively (not via a library) using touch events on `OrderCard` and `SavedOrderCard`. Swipe threshold: 80px. Only active on mobile breakpoint. Reveals a red delete zone behind the card.

### Form State Reset on Drink Type Change
When the drink type changes in `OrderForm`, dependent fields reset: variant, customVariant, iced, customDrinkName are cleared. Milk and sweetener types are preserved if the new drink supports them, otherwise reset to 'None'.

---

## Conventions

1. **Atomic Design:** atoms → molecules → organisms → templates → pages. Lower layers never import from higher layers.
2. **Barrel exports:** Each directory has an `index.ts` re-exporting all public modules.
3. **Co-location:** Tests (`.test.tsx`) and styles (`.module.css`) live alongside their component files.
4. **No direct localStorage access** in components — only through hooks.
5. **Data-driven UI:** All drink options, milk types, sweetener types defined in `src/config/`. Components read from config arrays, never hardcode option lists.
6. **Translation keys for all UI text:** No hardcoded strings in components. All user-facing text goes through `t()`.
7. **CSS custom properties:** All colours, spacing, typography, borders, shadows, and transitions reference design tokens. No magic values in component CSS.

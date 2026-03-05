# Components

## Directory structure

The codebase follows Feature-Sliced Design (FSD). Layers from lowest to highest:

### `src/shared/` — shared primitives

| Sub-directory | Contents |
|--------------|---------|
| `shared/assets/icons/` | SVG icon components (see Icons section below) |
| `shared/config/` | `DRINKS`, `MILK_TYPES`, `MILK_AMOUNTS`, `SWEETENER_TYPES`, `ASPECT_COLORS`, constants |
| `shared/hooks/` | `useLocalStorage`, `useBreakpoint`, `useUserId`, `useConfirmation` |
| `shared/i18n/` | i18next setup + `locales/en-GB.json` |
| `shared/types/` | `OrderFormData`, `MilkType`, `MilkAmount`, `SweetenerType`, CSS module types |
| `shared/utils/` | `generateId`, `now` |
| `shared/ui/` | Reusable UI primitives (see below) |

### `src/shared/ui/` — UI primitives

| Component | Description |
|-----------|-------------|
| `Button` | Variants: primary, secondary, danger, ghost, text. Supports `fullWidth`. |
| `Input` | Styled text input wrapping `<input>`. |
| `Select` | Styled `<select>` with custom chevron. Accepts `string` or `{value, label}` options. |
| `Checkbox` | Styled checkbox with label. |
| `IconButton` | Circular icon button. Variants: `default`, `primary`, `danger`, `mint`, `amber`. Requires `label` for a11y. |
| `Pill` | Generic coloured pill. Accepts `label` and `color: PillColor`. |
| `DragHandle` | Six-dot grip icon for drag-and-drop. |
| `FormField` | Label + children wrapper for form inputs. |
| `ConfirmDialog` | Modal overlay with title, message, cancel/confirm actions. |
| `Card` | Visual container with border, shadow, and border-radius. Accepts optional `className`. |
| `DrinkPills` | Renders a row of Pill components summarising a drink order. Used by entity card components. |
| `ActionCard` | Generic swipeable card with configurable action zones. Left zone: destructive actions; right zone: non-destructive actions. Accepts `drag?: DragBindings` for use with `ActionCardList`. |
| `ActionCardList` | DnD list that passes `DragBindings` to `renderItem`, eliminating the extra wrapper div. `onReorder` receives the full reordered array. |
| `Fab` | Floating Action Button. Rounded square, primary colour, renders `+`. Accepts `onClick` and `label` (aria-label). |

#### `ActionCard` details

```typescript
interface Action {
  ariaLabel: string  // accessible label for the icon button
  label: string      // text shown in the swipe zone button
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  color: 'default' | 'primary' | 'danger' | 'mint' | 'amber'
  destructive: boolean  // true → left zone, false → right zone
  callback: () => void
}
interface DragBindings {
  ref: (node: HTMLElement | null) => void
  listeners: React.HTMLAttributes<HTMLElement>
  style: React.CSSProperties
  isDragging: boolean
}
```

`ActionCardList.renderItem: (item: T, drag: DragBindings) => ReactNode` — the render callback receives bindings and the item itself IS the sortable DOM element.

### `src/entities/` — domain entities

Each entity slice has a `model/` directory (types + hook) and a `ui/` directory (entity-specific components).

| Entity | Model | UI Components |
|--------|-------|---------------|
| `run` | `Run` type, `useRun` hook | — |
| `active-order` | `ActiveOrder` type, `useActiveOrders` hook | `ActiveOrderCard`, `ActiveOrderList` |
| `saved-order` | `SavedOrder` type, `useSavedOrders` hook | `SavedOrderCard`, `SavedOrderList` |

### `src/widgets/` — composed UI blocks

| Widget | Description |
|--------|-------------|
| `RunHeader` | App title, Run status subtitle with order count, mobile help button. |
| `OrderForm` | Multi-field form driven by drink config. Manages own form state via `useOrderForm`. Submit disabled when no drink type or person name. Accepts `showActions` and `onValidityChange`. |
| `Mascot` | SVG coffee cup with 3 mood states (neutral/happy/overwhelmed). Wobble animation on mood change. |
| `DualPanelLayout` | Universal layout for all form factors. Fixed-width sidebar + flexible main panel. `sidebarActive` prop controls mobile panel switching via CSS classes. On desktop both panels are always visible. |
| `BottomAppBar` | `flex-shrink: 0` bar rendered at the bottom of each `DualPanelLayout` panel via `sidebarBottom`/`mainBottom` props. Accepts `left` and `right` ReactNode slots. |
| `PageTransition` | Wraps the main content area in `App.tsx`. Renders outgoing and incoming pages simultaneously during a 250ms navigation transition. Accepts `contentKey` (current screen name), `direction` (forward slides in from below; back slides in from above), and `children`. |

### `src/pages/` — full-screen page components

| Page | Description |
|------|-------------|
| `RunView` | Run view: mascot, order list, order delete confirmation dialog, Run start button. |
| `AddOrder` | New Order button + SavedOrderList. Delete Saved Order confirmation dialog. |
| `OrderFormPage` | Wrapper around OrderForm with title (New Order / Edit Order). |
| `LandingPage` | Onboarding tips panel: shown in the main panel when no Run is active. |

### `src/app/` — application root

| File | Description |
|------|-------------|
| `App.tsx` | Screen state machine, navigation handlers, layout assembly, context providers. |
| `contexts/RunContext.tsx` | Wraps `useRun()` — exposes `activeRun`, `startRun`, `archiveRun`. |
| `contexts/ActiveOrderContext.tsx` | Wraps `useActiveOrders()` — must nest inside `RunProvider`. |
| `contexts/SavedOrderContext.tsx` | Wraps `useSavedOrders()`. |
| `main.tsx` | React root, i18n init. |
| `styles/` | `tokens.css`, `global.css`, `textures.css`. |

## Assets

### Icons (`src/shared/assets/icons/`)

Six SVG icon components: `DragHandleIcon`, `EditIcon`, `DeleteIcon`, `CheckIcon`, `SlidersIcon`, `UndoIcon`.

- Accept `SVGProps<SVGSVGElement>` with default `width`/`height`
- No CSS module — styling comes from parent via `currentColor`
- No i18n — `aria-hidden` is set at the call site; the parent button owns the accessible label
- Import from the barrel: `import { EditIcon } from '@/shared/assets/icons'`

## Co-location convention

Every component file has two siblings in the same directory:

- `ComponentName.module.css` — component-scoped styles
- `ComponentName.test.tsx` — component tests

## Barrel exports

Each directory has an `index.ts` that re-exports everything in that directory. Import from the barrel:

```typescript
// correct
import { Button } from '@/shared/ui/Button'
import { useBreakpoint } from '@/shared/hooks'

// avoid
import { Button } from '@/shared/ui/Button/Button'
```

## Path alias

`@` resolves to `src/`. Use it for all non-relative imports.

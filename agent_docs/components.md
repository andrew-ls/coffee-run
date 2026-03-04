# Components

## Directory structure

The codebase is migrating from Atomic Design to Feature Sliced Design (FSD). Phase 1 has established a `src/shared/` layer containing primitives shared across the whole app.

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
| `SortableList` | Generic drag-and-drop list (existing pattern). Accepts render props for items and overlay. |
| `ActionCard` | Generic swipeable card with configurable action zones. Left zone: destructive actions; right zone: non-destructive actions. Accepts `drag?: DragBindings` for use with `ActionCardList`. |
| `ActionCardList` | DnD list that passes `DragBindings` to `renderItem`, eliminating the extra wrapper div. `onReorder` receives the full reordered array. |

#### `ActionCard` details

```typescript
interface Action {
  name: string
  label: string
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

## Atomic Design hierarchy (existing feature code)

Feature code still follows Atomic Design under `src/components/` while the migration to FSD is in progress:

| Level | Directory | Current components |
|-------|-----------|-------------------|
| Molecules | `molecules/` | DrinkPills, OrderCard, PageTransition |
| Organisms | `organisms/` | BottomAppBar, OrderForm, OrderList, RunHeader, SavedOrderList, Mascot |
| Templates | `templates/` | DualPanelLayout |

Pages (`src/pages/`) compose organisms: `RunView`, `AddOrder`, `OrderFormPage`, `LandingPage`.

Domain hooks (`src/hooks/`): `useRun`, `useOrders`, `useSavedOrders`.

Domain types (`src/types/`): `Order`, `SavedOrder`, `Run`, `OrderFormData`.

### Molecules

| Component | Description |
|-----------|-------------|
| `OrderCard` | Unified card with drag handle, name, drink pills, and swipe-to-delete. `mode="active"`: edit/delete actions, enter animation (`isNew`). `mode="saved"`: Use/Customised/Delete actions, no enter animation. Both modes support `dragHandleProps` and `isDragging`. |
| `DrinkPills` | Renders a row of Pill components summarising a drink Order. Used by OrderCard in both modes. |
| `PageTransition` | Wraps the main content area in `App.tsx`. Renders outgoing and incoming pages simultaneously during a 250ms navigation transition. Accepts `contentKey` (current screen name), `direction` (forward slides in from below; back slides in from above), and `children`. |

### Organisms

| Component | Description |
|-----------|-------------|
| `RunHeader` | App title, Run status subtitle with Order count. |
| `OrderForm` | Multi-field form driven by drink config. Manages own form state; resets dependent fields on drink type change. Submit disabled when no drink type or person name. Accepts `showActions` and `onValidityChange`. |
| `OrderList` | Wraps SortableList with OrderCard rendering. Detects newly added Orders for entry animation. |
| `SavedOrderList` | "Saved Orders" header + SortableList with `OrderCard` (`mode="saved"`) rendering. Shows empty state message. |
| `Mascot` | SVG coffee cup with 3 mood states (neutral/happy/overwhelmed). Wobble animation on mood change. |
| `BottomAppBar` | `flex-shrink: 0` bar rendered at the bottom of each DualPanelLayout panel via `sidebarBottom`/`mainBottom` props. Accepts `left` and `right` ReactNode slots. Also exports `Fab` — a styled FAB button. |

### Templates

| Component | Description |
|-----------|-------------|
| `DualPanelLayout` | Universal layout for all form factors. Fixed-width sidebar + flexible main panel. Consumes `SidebarContext` to apply `sidebarHidden`/`mainHidden` CSS classes for mobile panel switching. On desktop both panels are always visible. |

### Pages

| Component | Description |
|-----------|-------------|
| `RunView` | Run view: mascot, Order list, Order delete confirmation dialog, Run start button. |
| `AddOrder` | New Order button + SavedOrderList. Delete Saved Order confirmation dialog. |
| `OrderFormPage` | Wrapper around OrderForm with title (New Order / Edit Order). |
| `LandingPage` | Onboarding tips panel: shown in the main panel when no Run is active. |

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


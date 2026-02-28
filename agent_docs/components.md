# Components

## Atomic Design hierarchy

Components live under `src/components/` and follow Atomic Design:

| Level | Directory | Current components |
|-------|-----------|-------------------|
| Atoms | `atoms/` | Button, Input, Select, Checkbox, Pill, IconButton, DragHandle, SortableList |
| Molecules | `molecules/` | FormField, DrinkPills, OrderCard, SavedOrderCard, ConfirmDialog, PageTransition |
| Organisms | `organisms/` | BottomAppBar, OrderForm, OrderList, RunHeader, SavedOrderList, Mascot |
| Templates | `templates/` | DualPanelLayout |

Pages (`src/pages/`) sit outside `components/` and compose organisms: `RunView`, `AddOrder`, `OrderFormPage`, `LandingPage`.

The rule: each level may only import from levels below it. Pages may import from any level.

### Atoms

Foundational UI primitives with no business logic.

| Component | Description |
|-----------|-------------|
| `Button` | Variants: primary, secondary, danger, ghost, text. Supports `fullWidth`. |
| `Input` | Styled text input wrapping `<input>`. |
| `Select` | Styled `<select>` with custom chevron. Accepts `string` or `{value, label}` options. |
| `Checkbox` | Styled checkbox with label. |
| `IconButton` | Circular icon button. Variants: `default`, `primary`, `danger`, `mint` (mint hover, for Use/Done actions), `amber` (amber hover, for Edit/Customised actions). Requires `label` for a11y. |
| `Pill` | Generic coloured pill. Accepts `label` and `color: PillColor`. Used for drink type badges and aspect pills. |
| `DragHandle` | Six-dot grip icon for drag-and-drop. |
| `SortableList` | Generic drag-and-drop list using @dnd-kit. Accepts render props for items and overlay. Vertical-axis-only with pointer (8px distance) and touch (250ms delay) sensors. |

### Molecules

Composite components combining atoms.

| Component | Description |
|-----------|-------------|
| `FormField` | Label + children wrapper for form inputs. |
| `ConfirmDialog` | Modal overlay with title, message, cancel/confirm actions. |
| `OrderCard` | Order display card with drag handle, name, drink pills, edit/delete actions, swipe-to-delete. |
| `SavedOrderCard` | Saved Order card with drag handle, name, drink pills, Usual/Custom/Delete buttons, swipe-to-delete. |
| `DrinkPills` | Renders a row of Pill components summarising a drink Order. Shared by OrderCard and SavedOrderCard. |
| `PageTransition` | Wraps the main content area in `App.tsx`. Renders outgoing and incoming pages simultaneously during a 250ms navigation transition. Accepts `contentKey` (current screen name), `direction` (forward slides in from below; back slides in from above), and `children`. |

### Organisms

Complex UI blocks with internal state or business logic.

| Component | Description |
|-----------|-------------|
| `RunHeader` | App title, Run status subtitle with Order count. |
| `OrderForm` | Multi-field form driven by drink config. Manages own form state; resets dependent fields on drink type change. Submit disabled when no drink type or person name. Accepts `showActions` and `onValidityChange`. |
| `OrderList` | Wraps SortableList with OrderCard rendering. Detects newly added Orders for entry animation. |
| `SavedOrderList` | "Saved Orders" header + SortableList with SavedOrderCard rendering. Shows empty state message. |
| `Mascot` | SVG coffee cup with 3 mood states (neutral/happy/overwhelmed). Wobble animation on mood change. |
| `BottomAppBar` | `flex-shrink: 0` bar rendered at the bottom of each DualPanelLayout panel via `sidebarBottom`/`mainBottom` props. Accepts `left` and `right` ReactNode slots. Also exports `Fab` — a styled FAB button. |

### Templates

| Component | Description |
|-----------|-------------|
| `DualPanelLayout` | Universal layout for all form factors. Fixed-width sidebar + flexible main panel. Consumes `SidebarContext` to apply `sidebarHidden`/`mainHidden` CSS classes for mobile panel switching. On desktop both panels are always visible. Each panel is `display: flex; flex-direction: column; height: 100dvh`. |

### Pages

Screen-level components. Compose organisms and receive callbacks from App.tsx.

| Component | Description |
|-----------|-------------|
| `RunView` | Run view: mascot, Order list, Order delete confirmation dialog, Run start button. Navigation buttons and End Run dialog are in App.tsx BottomAppBar slots, not here. |
| `AddOrder` | New Order button + SavedOrderList. Delete Saved Order confirmation dialog. Navigation is provided by App.tsx via BottomAppBar. |
| `OrderFormPage` | Wrapper around OrderForm with title (New Order / Edit Order). Passes through `showActions` and `onValidityChange`. |
| `LandingPage` | Onboarding tips panel: shown in the main panel when no Run is active. |

## Assets

Shared non-component resources live under `src/assets/`.

### Icons (`src/assets/icons/`)

Five SVG icon components: `DragHandleIcon`, `EditIcon`, `DeleteIcon`, `CheckIcon`, `SlidersIcon`.

- Accept `SVGProps<SVGSVGElement>` with default `width`/`height`
- No CSS module — styling comes from parent via `currentColor`
- No i18n — `aria-hidden` is set at the call site; the parent button owns the accessible label
- Import from the barrel: `import { EditIcon } from '@/assets/icons'`

## Co-location convention

Every component file has two siblings in the same directory:

- `ComponentName.module.css` — component-scoped styles
- `ComponentName.test.tsx` — component tests

This is enforced by the 100% coverage requirement — a component without a test file will fail coverage.

## Barrel exports

Each directory has an `index.ts` that re-exports everything in that directory. Import from the barrel, not the file directly:

```typescript
// correct
import { Button, Input } from '@/components/atoms'

// avoid
import { Button } from '@/components/atoms/Button'
```

## Path alias

`@` resolves to `src/`. Use it for all non-relative imports.

# Components

## Atomic Design hierarchy

Components live under `src/components/` and follow Atomic Design:

| Level | Directory | Current components |
|-------|-----------|-------------------|
| Atoms | `atoms/` | Button, Input, Select, Checkbox, Badge, IconButton, DragHandle, SortableList |
| Molecules | `molecules/` | FormField, OrderCard, SavedOrderCard, ConfirmDialog |
| Organisms | `organisms/` | OrderForm, OrderList, RunHeader, SavedOrderList, Mascot |
| Templates | `templates/` | SinglePanelLayout, DualPanelLayout |

Pages (`src/pages/`) sit outside `components/` and compose organisms: `RunView`, `AddOrder`, `OrderFormPage`.

The rule: each level may only import from levels below it. Pages may import from any level.

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

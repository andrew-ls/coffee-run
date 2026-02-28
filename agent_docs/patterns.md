# Patterns

## Internationalisation (i18n)

- All UI text must use `useTranslation()` → `t('key')`. No hardcoded English strings in JSX.
- Translation keys live in `src/i18n/locales/en-GB.json`. Add new keys there when adding UI text.
- **Config enum values** (drink types, milk types, sweetener types) are stored raw in English in `localStorage` and in component state. They are translated only at the point of display using a translation key derived from the value. Never translate before storing.
- i18next is initialised in `src/i18n/index.ts`, which is imported in `src/main.tsx` before `<App />` renders.

**Library details:**

- **Library:** i18next + react-i18next
- **Locale:** Single `en-GB` locale bundled at build time (not lazy-loaded).
- **Interpolation escaping:** Disabled (`escapeValue: false`) — React handles XSS.
- **Pluralisation:** Used for Order count (`orderCount_one` / `orderCount_other`).
- **Arrays:** Use `t('key', { returnObjects: true })` to retrieve arrays (e.g. empty state messages).
- **App name:** Sourced from `app.name` i18n key — never hardcoded.

## Drink configuration

`src/config/drinks.ts` is the single source of truth for what drinks exist and which form fields each drink shows.

```typescript
interface DrinkConfig {
  type: string
  variants: readonly string[]
  allowOtherVariant: boolean      // show a free-text "other" variant input
  allowCustomDrinkName: boolean   // show a custom drink name field (used by "Other" type)
  pillColor: { background: string; text: string }
  fields: {
    iced: boolean
    milk: boolean
    milkAmount: boolean           // shown when milk type is not 'None'
    sweetener: boolean
    sweetenerAmount: boolean      // shown when sweetener type is not 'None'
    notes: boolean
  }
}
```

`OrderForm` iterates `DRINKS` to build the drink type selector and reads the matching `DrinkConfig.fields` to conditionally render each field section.

**Feature matrix** (see `agent_docs/product.md` for the full table with all drink types).

**To add a new drink type**: add a `DrinkConfig` entry to the `DRINKS` array in `drinks.ts`, then add the display name and any variant translations to `en-GB.json`.

`DRINK_TYPES` is derived from `DRINKS` via `.map(d => d.type)` — do not maintain it separately.

**Form state reset on drink type change:** When the drink type changes in `OrderForm`, dependent fields reset: `variant`, `customVariant`, `iced`, and `customDrinkName` are cleared. `milkType` and `sweetenerType` are preserved if the new drink supports them; otherwise reset to `'None'`.

## Drag-and-drop & swipe

**Drag-and-drop** is handled by `SortableList` using @dnd-kit with this configuration:
- **Sensors:** `PointerSensor` (8px activation distance), `TouchSensor` (250ms delay, 5px tolerance).
- **Modifiers:** `restrictToVerticalAxis` — vertical reorder only.
- **Collision detection:** `closestCenter`.
- **Strategy:** `verticalListSortingStrategy`.

**Swipe-to-delete** is implemented natively via `useSwipeToDelete` (touch events on `OrderCard`). Swipe threshold: 80px. Only active on mobile breakpoint.

- **Left swipe** on `OrderCard` (either mode): reveals a red delete zone.
- **Right swipe** on `OrderCard` (`enableRightSwipe: true` in both modes):
  - `mode="active"`: reveals a mint "Edit" zone.
  - `mode="saved"`: reveals a mint zone with "Use" (left) and "Customised" (right) actions.

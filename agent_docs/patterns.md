# Patterns

## Internationalisation (i18n)

- All UI text must use `useTranslation()` → `t('key')`. No hardcoded English strings in JSX.
- Translation keys live in `src/i18n/locales/en-GB.json`. Add new keys there when adding UI text.
- **Config enum values** (drink types, milk types, sweetener types) are stored raw in English in `localStorage` and in component state. They are translated only at the point of display using a translation key derived from the value. Never translate before storing.
- i18next is initialised in `src/i18n/index.ts`, which is imported in `src/main.tsx` before `<App />` renders.

## Drink configuration

`src/config/drinks.ts` is the single source of truth for what drinks exist and which form fields each drink shows.

```typescript
interface DrinkConfig {
  type: string
  variants: readonly string[]
  allowOtherVariant: boolean      // show a free-text "other" variant input
  allowCustomDrinkName: boolean   // show a custom drink name field (used by "Other" type)
  pillColor: PillColor            // { background: string; text: string } — Badge colours
  fields: {
    iced: boolean
    milk: boolean
    milkAmount: boolean
    sweetener: boolean
    sweetenerAmount: boolean
    notes: boolean
  }
}
```

`OrderForm` iterates `DRINKS` to build the drink type selector and reads the matching `DrinkConfig.fields` to conditionally render each field section.

**To add a new drink type**: add a `DrinkConfig` entry to the `DRINKS` array in `drinks.ts`, then add the display name translation to `en-GB.json`.

`DRINK_TYPES` is derived from `DRINKS` via `.map(d => d.type)` — do not maintain it separately.

## Styling

- CSS Modules only. No inline styles, no global class names (except in `global.css`).
- Class names must use `camelCase` — enforced by the `camelCaseOnly` option in `vite.config.ts`.
- Design tokens are CSS custom properties defined in `src/styles/tokens.css` (imported globally). Use them for all colours, spacing, typography, shadows, and transitions. Do not hardcode values.
- The `@` path alias resolves to `src/`. Use it in CSS Module `composes` if referencing another module.

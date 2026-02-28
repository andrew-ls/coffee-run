# Styling

## Approach

- **CSS Modules** with `camelCaseOnly` convention (configured in Vite).
- **Design tokens** in `src/styles/tokens.css` as CSS custom properties on `:root`. No magic values in component CSS — always reference a token.
- **Co-located styles:** Each component has a `.module.css` alongside it.
- **Global reset** in `src/styles/global.css`: box-sizing, margin/padding reset, font inheritance, button reset.
- **Texture overlay** in `src/styles/textures.css`: SVG fractal noise `::before` pseudo-element on `#root` at `opacity: 0.035`, giving a crayon/paper feel.

## Visual Design

### Aesthetic

Cozy, warm, charming — inspired by cozy games. Hand-made feel with soft shapes and gentle animations.

### Typography

- Font: **Nunito** (Google Fonts), weights 400/600/700/800.
- Rounded, friendly appearance.

### Borders & Shapes

- Rounded corners on all cards and buttons (8px–16px, `9999px` for pills).
- Soft shadows rather than hard borders.

### Mascot

SVG coffee cup character with a face. Three moods based on Order count:

- **Neutral** (0 Orders): Flat mouth, warm tan fill, steam wisps.
- **Happy** (1–4 Orders): Smile, mint green fill, steam wisps.
- **Overwhelmed** (5+ Orders): X-eyes, frown, pink fill, no steam.

The mascot wobbles (600ms animation) when its mood changes.

### Animations

- **Page transitions:** Mobile panels slide horizontally (250ms). Main content screens animate with direction-aware vertical slide: forward navigations (landing→add, add→form) slide in from below; back navigations slide in from above.
- **Order card entry:** New Order cards slide in with a bounce (400ms).
- **Mascot mood change:** Wobble (600ms).
- **Button press:** Scale to 0.97 on active.
- **Confirm dialog:** Fade-in overlay + scale-in dialog (bounce easing).
- **Drag overlay:** Elevated with large shadow at 0.95 opacity.

---

## Design Tokens

All tokens are CSS custom properties defined in `src/styles/tokens.css`.

### Colour Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#FDF6EC` | Page background |
| `--color-bg-card` | `#FFF9F0` | Card / sidebar background |
| `--color-bg-input` | `#FFFCF7` | Input field background |
| `--color-primary` | `#6F4E37` | Coffee brown — buttons, headings, borders |
| `--color-primary-hover` | `#5A3E2B` | — |
| `--color-primary-light` | `#8B6E55` | — |
| `--color-secondary` | `#D4A574` | Caramel accent |
| `--color-accent-pink` | `#E8A0BF` | — |
| `--color-accent-mint` | `#A8D8B9` | — |
| `--color-accent-amber` | `#F59E0B` | Edit/Customised button hover |
| `--color-accent-peach` | `#FBBF77` | — |
| `--color-accent-lavender` | `#C3AED6` | — |
| `--color-danger` | `#D9534F` | — |
| `--color-danger-hover` | `#C9302C` | — |
| `--color-danger-bg` | `#FDE8E8` | — |
| `--color-text` | `#3E2723` | Dark warm brown |
| `--color-text-muted` | `#8D7B6E` | — |
| `--color-border` | `#E0D5C8` | — |
| `--color-border-focus` | `#6F4E37` | — |
| `--color-shadow` | `rgba(111, 78, 55, 0.1)` | — |
| `--color-overlay` | `rgba(62, 39, 35, 0.4)` | Dialog backdrop |

### Drink Pill Colours

Each drink type has a distinct pill colour for visual scanning (defined in `src/config/aspectColors.ts`):

| Drink | Background |
|-------|-----------|
| Coffee | `#F0E0CC` (warm tan) |
| Tea | `#E8F5E9` (soft green) |
| Hot Chocolate | `#F3E5F5` (light purple) |
| Juice | `#FFF3E0` (warm orange) |
| Other | `#E0E0E0` (neutral grey) |

Aspect pills by category:

| Category | Background |
|----------|-----------|
| Iced | `#E3F2FD` (blue) |
| Variant | `#EDE7F6` (purple) |
| Milk | `#FFF8E1` (warm yellow) |
| Sweetener | `#FCE4EC` (pink) |

### Spacing

`--space-xs` (4px), `--space-sm` (8px), `--space-md` (12px), `--space-lg` (16px), `--space-xl` (24px), `--space-2xl` (32px), `--space-3xl` (48px).

### Typography

| Token | Value |
|-------|-------|
| `--font-size-sm` | 0.875rem |
| `--font-size-md` | 1rem |
| `--font-size-lg` | 1.125rem |
| `--font-size-xl` | 1.25rem |
| `--font-size-2xl` | 2rem |

Weights: regular (400), semibold (600), bold (700), extrabold (800).

### Borders

`--radius-sm` (8px), `--radius-md` (12px), `--radius-lg` (16px), `--radius-full` (9999px).

### Shadows

`--shadow-sm`, `--shadow-md`, `--shadow-lg` — all use `--color-shadow`.

### Transitions

| Token | Value |
|-------|-------|
| `--duration-fast` | 150ms |
| `--duration-normal` | 250ms |
| `--duration-slow` | 400ms |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

### Layout

`--sidebar-width`: 360px. `--header-height`: 64px.

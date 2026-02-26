# Coffee Run — Product Specification

## Overview

Coffee Run is a single-page web application for managing group coffee Orders in an office setting. A user starts a "Run", collects drink Orders from colleagues, and tracks them in a checklist. The app supports saving frequently-ordered drinks for quick recall, drag-and-drop reordering, and works responsively across mobile and desktop.

There is no backend — all data is persisted in the browser's localStorage. There is no routing — navigation is managed as a screen state machine within the app.

---

## Core Concepts

### Run

A **Run** is a single coffee-fetching session. Only one Run can be active at a time per user. The user starts a Run, adds Orders to it, then ends it. Ending a Run archives it (preserving history) and clears the active Order list.

### Order

An **Order** is a single drink request within a Run. Each Order belongs to a named person and captures their drink preferences using a structured form driven by drink configuration.

### Saved Order

A **Saved Order** is a bookmark of someone's usual drink. The user can save an Order during creation, then recall it later with one tap ("Usual") or pre-fill a form for modification ("Custom").

---

## Screens & Workflow

The app has three screens, managed by an internal state machine (not URL-based):

### 1. Run View (Main Screen)

The primary screen showing the current active Run.

**No active Run state:**
- Displays the mascot with a random playful empty-state message.
- A "Start a new Run" button begins a new Run.

**Active Run, no Orders state:**
- Displays the mascot with a random empty-state message.
- A floating action button (FAB) with "+" to add Orders.
- An "End Run" text button in the bottom bar.

**Active Run with Orders:**
- The mascot is displayed above the Order list, reacting to the Order count.
- A scrollable list of Order cards, each showing:
  - Drag handle for reordering
  - Person's name
  - Drink summary as coloured pills (drink type badge, iced, variant, milk, sweetener)
  - Edit and delete icon buttons (hover-revealed on desktop, always visible on mobile)
- Swipe-to-delete on mobile (swipe left reveals a red delete zone).
- A bottom bar with "End Run" (text button) and the FAB.
- "End Run" requires confirmation via a dialog ("End this round? Everyone sorted? This will clear all current Orders.").
- Deleting an Order also requires confirmation via a dialog.

### 2. Add Order Screen

Reached by tapping the FAB on the Run view. On mobile, this is a full-page transition with a "Back" button. On desktop, it appears in the right panel.

**Layout:**
- A "New Order" button at the top to open a blank Order form.
- A "Saved Orders" section listing all Saved Orders. Each card shows:
  - Drag handle for reordering
  - Person's name
  - Drink summary pills
  - "Usual" button — adds their Saved Order directly to the Run and returns to the Run view.
  - "Custom" button — opens the Order form pre-filled with their Saved Order for modification.
- Swipe-to-delete on mobile for removing Saved Orders.

### 3. Order Form Screen

Used for creating new Orders, editing existing Orders in the Run, and customising Saved Orders. The form fields adapt based on the selected drink type.

**Fields (conditional based on drink config):**
- **Name** — text input, required, auto-focused
- **Drink type** — select from configured drink types
- **Custom drink name** — text input, shown only for "Other" drink type
- **Variant** — select from drink-specific variant list, including "Other" freetext option where configured
- **Custom variant** — text input, shown when variant is "Other"
- **Iced** — checkbox, shown only for drink types that support it
- **Milk type** — select, shown for drink types that support milk
- **Milk amount** — select (Splish/Splash/Splosh), shown when milk type is not "None" and drink supports milk amount
- **Sweetener type** — select, shown for drink types that support sweetener
- **Sweetener amount** — numeric input (0–5, step 0.5), shown when sweetener type is not "None" and drink supports sweetener amount
- **Notes** — freetext textarea, shown for all drink types that support notes

**Bottom of form:**
- A "Remember this one for next time?" checkbox — saves the Order for future recall.
- "Add Order" / "Update Order" submit button (label varies by context).
- "Cancel" button returns to the add screen.

**Behaviour by context:**
- **New Order:** All fields empty. Submit adds to the Run.
- **Edit (from Run):** Fields pre-filled from the existing Order. Submit updates the Order in the Run.
- **Custom (from Saved):** Fields pre-filled from the Saved Order. Submit adds a new Order to the Run. The save checkbox, if checked, creates a new Saved Order entry.

---

## Responsive Layout

### Mobile (< 768px)
- Single-column, full-width layout.
- Full-page transitions between screens (slide-in animation).
- Touch-friendly: swipe-to-delete, large tap targets.
- Bottom bar with FAB and End Run button on the Run view.
- Order card action buttons always visible.

### Desktop (≥ 768px)
- Two-panel layout:
  - **Left sidebar** (360px fixed width): Run header, Order list, bottom bar with End Run + FAB.
  - **Right main panel**: Add Order screen or Order Form. When no Run is active, the right panel is empty.
- Only the right panel changes on navigation — the sidebar persists.
- Order card action buttons revealed on hover.
- The Add Order screen is the default right panel content when a Run is active.

---

## Drink Configuration Schema

All drink options are data-driven from configuration. The form adapts dynamically based on the selected drink type.

### Drink Types

| Drink | Variants | Other Variant | Custom Name | Iced | Milk | Milk Amount | Sweetener | Sweetener Amount | Notes |
|-------|----------|---------------|-------------|------|------|-------------|-----------|------------------|-------|
| Coffee | Americano, Latte, Cappuccino, Flat White, Espresso, Mocha | Yes | No | Yes | Yes | Yes | Yes | Yes | Yes |
| Tea | English Breakfast, Earl Grey, Green, Peppermint, Chamomile | Yes | No | Yes | Yes | Yes | Yes | Yes | Yes |
| Hot Chocolate | Classic, White, Mint | No | No | No | Yes | Yes | No | No | Yes |
| Juice | Orange, Apple, Cranberry | Yes | No | No | No | No | No | No | Yes |
| Other | *(none)* | No | Yes | No | No | No | No | No | Yes |

- **Other Variant**: When enabled and a user selects "Other" as their variant, a freetext field appears for the variant name, and all the drink type's standard extras are shown.
- **Custom Name**: When the drink type is "Other", only a freetext name field and Notes are shown — no other extras.

### Milk Types
`Regular, Semi-Skimmed, Skimmed, Oat, Soy, Almond, Coconut, None`

### Milk Amount
- **Splish** — a dash of milk (least)
- **Splash** — standard amount (default)
- **Splosh** — more than standard (most)

### Sweetener Types
`Sugar, Brown Sugar, Honey, Sweetener, None`

### Sweetener Amount
Numeric input: 0 to 5, in 0.5 increments.

---

## Visual Design

### Aesthetic
Cozy, warm, charming — inspired by cozy games. Hand-made feel with soft shapes and gentle animations.

### Colour Palette
- **Background:** Warm creamy beige (`#FDF6EC`)
- **Cards:** Slightly warmer cream (`#FFF9F0`)
- **Primary accent:** Coffee brown (`#6F4E37`)
- **Text:** Dark warm brown (`#3E2723`)
- **Secondary:** Warm caramel (`#D4A574`)
- **Candy accents:** Soft pink (`#E8A0BF`), mint (`#A8D8B9`), peach (`#FBBF77`), lavender (`#C3AED6`)
- **Danger:** Muted red (`#D9534F`)

### Drink Pill Colours
Each drink type has a distinct pill colour for visual scanning:
- Coffee: warm tan (`#F0E0CC`)
- Tea: soft green (`#E8F5E9`)
- Hot Chocolate: light purple (`#F3E5F5`)
- Juice: warm orange (`#FFF3E0`)
- Other: neutral grey (`#E0E0E0`)

Aspect pills have category-specific colours:
- Iced: blue (`#E3F2FD`)
- Variant: purple (`#EDE7F6`)
- Milk: warm yellow (`#FFF8E1`)
- Sweetener: pink (`#FCE4EC`)

### Texture
A subtle SVG fractal noise overlay (`opacity: 0.035`) on the root element provides a crayon/paper texture.

### Typography
- Font: **Nunito** (Google Fonts), weights 400/600/700/800.
- Rounded, friendly appearance.

### Borders & Shadows
- Rounded corners on all cards and buttons (8px–16px, `9999px` for pills).
- Soft shadows rather than hard borders.

### Animations
- **Page transitions:** Mobile screens slide in from the right (250ms).
- **Order card entry:** New Order cards slide in with a bounce (400ms).
- **Mascot mood change:** Wobble animation (600ms) when mood transitions.
- **Button press:** Scale down to 0.97 on active.
- **Confirm dialog:** Fade-in overlay with scale-in dialog (bounce easing).
- **Drag overlay:** Elevated with large shadow at 0.95 opacity.

### Mascot
A simple inline SVG coffee cup character with a face. Three reactive moods based on Order count:
- **Neutral** (0 Orders): Flat mouth, warm tan fill, steam wisps.
- **Happy** (1–4 Orders): Smile curve, mint green fill, steam wisps.
- **Overwhelmed** (5+ Orders): X-eyes, frown, pink fill, no steam.

The mascot wobbles when its mood changes.

### Copy & Tone
Warm, gently British voice. Playful copy in non-interactive text:
- Empty state messages rotate randomly: "The kettle's gone cold...", "Nobody's thirsty?", "Bit quiet in here...", "Who fancies a brew?", "The mugs are gathering dust..."
- Start Run: "Start a new Run"
- Run status: "Run in progress"
- No Run: "No Run on — fancy starting one?"
- End Run confirmation: "End this round? Everyone sorted? This will clear all current Orders."
- Delete Order confirmation: "Are you sure you want to bin this one?"
- Cancel button: "Never mind"
- Save checkbox: "Remember this one for next time?"
- Saved Orders empty: "No Saved Orders yet. Save one from the Order form!"
- Action buttons remain concise: "Add Order", "Update Order", "End Run", "Usual", "Custom", "New Order", "Back".

---

## Internationalisation

All user-facing strings are externalised via i18n with a single `en-GB` locale. The app is structured to support additional locales. Drink type names, variant names, milk types, and sweetener types are all translation keys.

---

## Planned Features (Not Yet Implemented)

The following capabilities are designed into the data model or hook layer but have no UI:

1. **Multi-user authentication** — The `useUserId` hook currently returns a hardcoded `'default-user'`. The data model includes `userId` on Runs and Saved Orders, ready for multi-user support.
2. **Run history viewing** — Completed Runs are archived (not deleted) with an `archivedAt` timestamp. There is no UI to browse past Runs.
3. **Saved Order overwrite on Custom flow** — When using "Custom" to modify a Saved Order and checking "Save", the current implementation creates a new Saved Order rather than updating the original.

---

## Known Issues

1. **Swipe-to-delete reset** — On `SavedOrderCard`, swiping partially and then not completing the swipe does not always reset the card position cleanly. The `offsetX` state persists until the next touch interaction.
2. **Order form validation** — The submit button is disabled only when no drink type is selected. The name field is required in logic but there is no visible validation error state shown to the user.
3. **Saved Order duplication** — The "Save for later" checkbox always creates a new Saved Order entry. There is no deduplication by person name or matching against existing Saved Orders.

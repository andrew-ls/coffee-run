# Product

## Overview

Coffee Run is a single-page web app for managing group coffee Orders in an office setting. A user starts a "Run", collects drink Orders from colleagues, and tracks them in a checklist. Supports saving frequently-ordered drinks for quick recall, drag-and-drop reordering, and works responsively across mobile and desktop.

No backend — all data is persisted in localStorage. No routing — navigation is a screen state machine.

## Core Concepts

**Run** — A single coffee-fetching session. Only one Run can be active at a time per user. The user starts a Run, adds Orders to it, then ends it. Ending a Run archives it (preserving history) and clears the active Order list.

**Order** — A single drink request within a Run. Belongs to a named person; captures drink preferences via a structured form driven by drink configuration.

**Saved Order** — A bookmark of someone's usual drink. Can be recalled with one tap ("Usual") or used to pre-fill a form for modification ("Custom").

## Screens & Workflow

The app has three screens managed by an internal state machine (not URL-based).

### 1. Run View (main screen)

**No active Run:** Mascot + random empty-state message + "Start a new Run" button.

**Active Run, no Orders:** Mascot + random empty-state message + FAB ("+" button) + "End Run" text button in the bottom bar.

**Active Run with Orders:**

- Mascot above the Order list, reacting to Order count.
- Scrollable list of Order cards, each showing: drag handle, person's name, drink pills (drink type badge, iced, variant, milk, sweetener), edit/delete icon buttons (hover-revealed on desktop, always visible on mobile).
- Swipe-to-delete on mobile (left swipe reveals a red delete zone).
- Bottom bar: "End Run" text button (left) + FAB (right).
- "End Run" requires confirmation: *"End this round? Everyone sorted? This will clear all current Orders."*
- Deleting an Order requires confirmation.

### 2. Add Order Screen

Reached by tapping the FAB. On mobile: full-page transition, bottom bar shows "Back". On desktop: always visible in the right panel.

- "New Order" button at the top opens a blank Order form.
- Saved Orders section listing all Saved Orders. Each card shows:
  - Drag handle, person's name, drink pills.
  - Checkmark button ("Usual") — adds the Saved Order directly to the Run and returns to Run view.
  - Sliders button ("Custom") — opens the Order form pre-filled for modification.
  - Trash button ("Delete", danger style) — removes after confirmation.
- **Desktop:** Three icon buttons are hover-revealed with a gradient.
- **Mobile:** Icon buttons are hidden; swipe left reveals delete zone; swipe right reveals a split zone with "Usual" (mint) and "Custom" (peach) actions.

### 3. Order Form Screen

Used for new Orders, editing existing Orders, and customising Saved Orders. Fields adapt based on selected drink type.

**Fields (conditional on drink config):**

- Name — text input, required, auto-focused
- Drink type — select
- Custom drink name — shown only for "Other" drink type
- Variant — drink-specific select; includes "Other" freetext option where configured
- Custom variant — shown when variant is "Other"
- Iced — checkbox, only for drinks that support it
- Milk type — select, only for drinks with milk
- Milk amount — select (Splish/Splash/Splosh), shown when milk type is not "None"
- Sweetener type — select, only for drinks with sweetener
- Sweetener amount — numeric (0–5, step 0.5), shown when sweetener type is not "None"
- Notes — freetext textarea, for all drinks that support notes

**Bottom of form:** "Remember this one for next time?" checkbox.

**Bottom bar:** "Add Order" / "Update Order" submit (disabled until drink type is selected) + "Cancel".

**Behaviour by context:**

- New Order: all fields empty, submit adds to Run.
- Edit (from Run): fields pre-filled, submit updates the Order.
- Custom (from Saved): fields pre-filled from Saved Order, submit adds a new Order to the Run.

## Responsive Layout

### Mobile (< 768px)

- Single-column, full-width layout.
- Panel transitions via CSS transform slide (250ms). Both panels always in the DOM; only one visible, controlled by `SidebarContext`.
- Touch-friendly: swipe-to-delete, large tap targets.
- Bottom bar contents vary by active panel:
  - **Run view panel** (active run): End Run (left) + FAB (right).
  - **Add Order panel:** Back (ghost button, left).
  - **Order form panel:** Cancel (left) + Add/Update Order (right).
- Order card action buttons always visible.

### Desktop (≥ 768px)

- Two-panel layout (both panels always visible side by side):
  - **Left sidebar** (360px): Run header, Order list. Bottom bar shows End Run when a Run is active.
  - **Right panel:** Add Order or Order Form. Bottom bar shows Cancel + Add/Update Order on the form screen.
- Only the right panel changes on navigation — sidebar persists.
- Order card action buttons revealed on hover.
- The Add Order screen is the default right panel content when a Run is active.
- FAB not shown on desktop (Add Order is always visible in the right panel).


## Drink Configuration Schema

All drink options are data-driven from config. The form adapts dynamically based on the selected drink type.

### Drink Types

| Drink | Variants | Other Variant | Custom Name | Iced | Milk | Milk Amount | Sweetener | Sweetener Amount | Notes |
|-------|----------|---------------|-------------|------|------|-------------|-----------|------------------|-------|
| Coffee | Americano, Latte, Cappuccino, Flat White, Espresso, Mocha | Yes | No | Yes | Yes | Yes | Yes | Yes | Yes |
| Tea | English Breakfast, Earl Grey, Green, Peppermint, Chamomile | Yes | No | Yes | Yes | Yes | Yes | Yes | Yes |
| Hot Chocolate | Classic, White, Mint | No | No | No | Yes | Yes | No | No | Yes |
| Juice | Orange, Apple, Cranberry | Yes | No | No | No | No | No | No | Yes |
| Other | *(none)* | No | Yes | No | No | No | No | No | Yes |

- **Other Variant:** When enabled, selecting "Other" as variant shows a freetext field and all standard extras for that drink type.
- **Custom Name:** When drink type is "Other", only a freetext name field and Notes are shown.

### Milk Types

`Regular, Semi-Skimmed, Skimmed, Oat, Soy, Almond, Coconut, None`

### Milk Amount

- **Splish** — a dash (least)
- **Splash** — standard (default)
- **Splosh** — more than standard (most)

### Sweetener Types

`Sugar, Brown Sugar, Honey, Sweetener, None`

### Sweetener Amount

Numeric: 0 to 5, in 0.5 increments.

## Copy & Tone

Warm, gently British voice. Playful copy in non-interactive text:
- Empty state messages rotate randomly: *"The kettle's gone cold..."*, *"Nobody's thirsty?"*, *"Bit quiet in here..."*, *"Who fancies a brew?"*, *"The mugs are gathering dust..."*
- Start Run: "Start a new Run"
- Run status: "Run in progress"
- No Run: "No Run on — fancy starting one?"
- End Run confirmation: *"End this round? Everyone sorted? This will clear all current Orders."*
- Delete Order confirmation: *"Are you sure you want to bin this one?"*
- Cancel: "Never mind"
- Save checkbox: "Remember this one for next time?"
- Saved Orders empty: "No Saved Orders yet. Save one from the Order form!"
- Action buttons remain concise: "Add Order", "Update Order", "End Run", "Usual", "Custom", "New Order", "Back".

## Internationalisation

All user-facing strings are externalised via i18n with a single `en-GB` locale. Drink type names, variant names, milk types, and sweetener types are all translation keys. See `agent_docs/patterns.md` for implementation detail.

## Planned Features (Not Yet Implemented)

1. **Multi-user authentication** — `useUserId` currently returns a hardcoded `'default-user'`. The data model includes `userId` on Runs and Saved Orders, ready for multi-user support.
2. **Run history viewing** — Completed Runs are archived (not deleted) with an `archivedAt` timestamp. There is no UI to browse past Runs.
3. **Saved Order overwrite on Custom flow** — When using "Custom" and checking "Save", the current implementation creates a new Saved Order rather than updating the original.

## Known Issues

1. **Swipe-to-delete reset** — On `OrderCard` (`mode="saved"`), swiping partially and not completing the swipe does not always reset the card position cleanly. The `offsetX` state persists until the next touch interaction.
2. **Order form validation** — The submit button is disabled only when no drink type is selected. The name field is required in logic but there is no visible validation error shown to the user.
3. **Saved Order duplication** — The "Save for later" checkbox always creates a new Saved Order. There is no deduplication by person name or matching against existing Saved Orders.

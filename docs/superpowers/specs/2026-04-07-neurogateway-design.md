# NeuroGateway — Design Spec
**Date:** 2026-04-07
**Context:** Vibe coding competition prototype
**Goal:** Win by combining emotional impact, visual polish, and full-featured depth

---

## Overview

NeuroGateway is a personal patient gateway for people living with neurological illness (Parkinson's, MS, dementia, stroke recovery, epilepsy, ALS, Alzheimer's). It is a calm, accessible, local-first daily life management hub. All data lives in `localStorage` — no backend, no login, no cloud sync.

---

## Technical Architecture

**Delivery:** Multi-file vanilla JS app (no build step, open `index.html` directly)

```
neuro-app/
├── index.html            # Shell, router, onboarding wizard, all <section> views
├── css/
│   ├── main.css          # Global tokens, layout, typography, themes
│   └── modules.css       # Per-module styles
├── js/
│   ├── app.js            # Hash router, init, global event listeners
│   ├── storage.js        # localStorage read/write helpers
│   ├── clock.js          # Live clock — updates every second via setInterval
│   ├── seed.js           # Pre-populated data: recipes, helplines, pantry defaults
│   └── modules/
│       ├── home.js       # Dashboard: status row, module tile grid, birthday alerts
│       ├── medications.js
│       ├── calendar.js
│       ├── ice-contacts.js
│       ├── passwords.js
│       ├── food.js
│       ├── bills.js
│       ├── puzzles.js
│       ├── wellness.js
│       ├── doctors-notes.js
│       ├── recipes.js
│       ├── transportation.js
│       ├── community.js
│       ├── helplines.js
│       ├── birthdays.js
│       └── pets.js
└── assets/               # (user images stored as base64 in localStorage)
```

**Routing:** Hash-based. `index.html` contains one `<section id="home">`, `<section id="medications">`, etc. for each view. `app.js` listens to `hashchange`, hides all sections, shows the one matching `location.hash`. Unknown hash → redirect to `#home`. Default on load: if onboarding not complete, show `#onboarding`; else `#home`.

**Icons:** Lucide icons via CDN.
**Fonts:** System font stack; Georgia serif for clock numerals.
**No frameworks, no build step, no npm.**

---

## Visual Design

**Theme:** Morning Calm (default light theme)
- Background: `#f0ece4` (warm cream)
- Primary: `#2c5f7a` (slate blue)
- Secondary: `#4a7c59` (sage green)
- Accent: `#c07830` (warm amber)
- Card background: `#ffffff`
- Text: `#2a2a2a`
- Focus outline: `3px solid #2c5f7a` (the primary blue)

**Dark theme** and **High Contrast theme** are toggled via a `data-theme` attribute on `<body>`. Dark: deep navy `#0f1d2e` background, `#e8d5a3` text. High Contrast: pure black `#000000` background, pure white `#ffffff` text, yellow `#ffff00` focus. Token values defined as CSS custom properties in `main.css`.

**Clock:** Bold digital — large serif numerals (Georgia, 80px+), AM/PM superscript, day name + date below.

**Typography:** Min 18px body, 24px+ headings, 48×48px minimum tap targets.

**`prefers-reduced-motion`:** All CSS transitions and JS animations must be wrapped in a `@media (prefers-reduced-motion: no-preference)` check. Default: no animation.

**Module color bands (bottom border on tiles) — all 15 listed:**

| Band | Color | Modules |
|------|-------|---------|
| Blue (Health/Core) | `#2c5f7a` | Medications, Calendar, ICE Contacts, Recipe Book |
| Green (Wellness) | `#4a7c59` | Brain Puzzles, Calm & Wellness, Doctor's Notes, Birthdays |
| Amber (Daily Life) | `#c07830` | Food & Grocery, Bills & Banking, Passwords, Pet Care |
| Teal (Community) | `#2a8a8a` | Transportation, Community, Helplines |

---

## Home Screen

**Top bar:** App name left; "🚨 ICE Contacts" (orange, `#e05c1a`) + "⚙ Settings" right — always visible regardless of current route. Role: `navigation`, aria-label "Main navigation".

**Clock card:** White card, blue left border, slate-blue bold digital time, sage-green day name, "Good morning/afternoon/evening, [Name]" greeting. `home.js` calls `clock.js` to update every second.

**Status row:** Up to 3 pills showing: medication status for current time slot, next calendar event, upcoming birthday (3-day window). Color-coded (green = ok, blue = info, amber = warn). Status pills are computed by `home.js` on each render — these are display-only; no background polling or OS notifications. Reminders only show when the app is open.

**Module grid:** 3-column grid of large tap tiles, icon + label, color-banded by category. Only modules listed in `ng_profile.enabledModules` appear.

---

## Onboarding Wizard (first load)

3 steps, `<section id="onboarding">`. Shown when `ng_profile` is absent from localStorage.

1. **Welcome** — text input: name (required), optional diagnosis label
2. **Select modules** — checkbox grid of all 15; pre-checked: Medications, Calendar, ICE Contacts, Helplines, Doctor's Notes
3. **Set PIN** — 4-digit PIN entry for Password Manager. Step shown only if Passwords module is checked. Can be skipped — if skipped, `ng_profile.pin` is `null`. If user later enables Passwords via Settings, they are prompted to set a PIN at that point (a modal PIN-setup flow, not a return to onboarding).

On wizard complete: write `ng_profile`, seed `ng_helplines` and `ng_recipes` from `seed.js` if empty, redirect to `#home`.

---

## Data Model (localStorage keys)

| Key | Contents |
|-----|----------|
| `ng_profile` | `{name, photo, diagnosis, enabledModules[], pin, fontSize, theme}` |
| `ng_contacts` | Array `{id, name, role, phone, email, photo, isICE, isMedMonitor, notes}` |
| `ng_medications` | Array `{id, brandName, genericName, dosage, form, instructions, schedule[], pillPhoto, pillDescription, labelText}` |
| `ng_med_log` | Array `{date, medicationId, slot, taken, timestamp}` |
| `ng_events` | Array `{id, title, date, time, type, location, notes, contactId}` |
| `ng_passwords` | Array `{id, label, category, username, password, notes}` |
| `ng_food_links` | Array `{id, label, url}` |
| `ng_pantry` | Array `{id, item, have}` |
| `ng_bills` | Array `{id, name, dueDay, amount, url, notes}` |
| `ng_notes` | Array `{id, date, provider, location, body}` |
| `ng_recipes` | Array `{id, name, category, ingredients[], steps[], prepTime, benefit, isCustom}` |
| `ng_birthdays` | Array `{id, name, relationship, date, email, photo}` |
| `ng_pets` | Array `{id, name, species, breed, vetContact, vetNotes, feedingTimes[], walkSchedule, appointments[]}` |
| `ng_community` | Array `{id, name, address, phone, url, notes, schedule}` |
| `ng_wellness_links` | Array `{id, label, url}` |
| `ng_helplines` | Array `{id, name, phone, description}` |
| `ng_transport` | Array `{id, label, url, phone, notes}` |
| `ng_puzzle_streak` | `{lastDate, streak}` |

**`schedule[]` shape for medications:**
```js
schedule: [
  { slot: "morning",   time: "08:00" },
  { slot: "evening",   time: "18:00" }
]
// slot values: "morning" | "afternoon" | "evening" | "bedtime"
```

**`ng_med_log` missed-dose check logic:**
On each render of the Medications module and the Home screen status pill, iterate today's `schedule[]` entries for each medication. For each slot where `time` is more than 60 minutes in the past and no `ng_med_log` entry exists with `{date: today, medicationId, slot, taken: true}`, mark that slot as missed. Display missed slots in amber. The Email notification hook for caregiver alert is triggered here — see Integration Point comment in `medications.js`.

**Calendar event types and colors:**
| Type | Color |
|------|-------|
| Medical Appointment | `#2c5f7a` (blue) |
| Social Obligation | `#4a7c59` (green) |
| Visitor Coming | `#c07830` (amber) |
| At-Home Care / Aide Visit | `#2a8a8a` (teal) |
| Personal Reminder | `#7a5c3a` (brown) |

---

## Seed Data (`seed.js`)

### Pre-loaded Helplines
```js
[
  { id: 'h1', name: '911 Emergency',             phone: '911',           description: 'Life-threatening emergencies' },
  { id: 'h2', name: 'Poison Control',            phone: '1-800-222-1222', description: 'Accidental ingestion or exposure' },
  { id: 'h3', name: 'Crisis / Mental Health',    phone: '988',           description: 'Suicide & Crisis Lifeline — call or text' },
  { id: 'h4', name: 'SAMHSA Helpline',           phone: '1-800-662-4357', description: 'Substance use and mental health' },
  { id: 'h5', name: "Alzheimer's Association",   phone: '1-800-272-3900', description: 'Alzheimer\'s and dementia support' },
  { id: 'h6', name: 'VNA / Home Health',         phone: '',              description: 'Your local home health agency (add number)' },
  { id: 'h7', name: 'Primary Care Nurse Line',   phone: '',              description: 'Your doctor\'s nurse line (add number)' },
]
```

### Pre-loaded Recipes (10 starters)
```js
[
  { id:'r1',  name:'Blueberry Oatmeal',        category:'Breakfast', prepTime:'10 min',
    ingredients:['1 cup rolled oats','1 cup milk or water','½ cup fresh blueberries','1 tbsp honey','Pinch of cinnamon'],
    steps:['Cook oats with milk per package directions.','Top with blueberries, honey, and cinnamon.'],
    benefit:'Blueberries are rich in antioxidants that support brain cell health.', isCustom:false },

  { id:'r2',  name:'Salmon with Greens',       category:'Dinner', prepTime:'20 min',
    ingredients:['1 salmon fillet','2 cups spinach or kale','1 tbsp olive oil','Lemon juice','Salt and pepper'],
    steps:['Season salmon. Cook in skillet 4 min per side.','Wilt greens in same pan with olive oil.','Serve together with lemon.'],
    benefit:'Omega-3 fatty acids in salmon support brain and nerve health.', isCustom:false },

  { id:'r3',  name:'Avocado Toast',            category:'Breakfast', prepTime:'5 min',
    ingredients:['2 slices whole-grain bread','1 ripe avocado','Lemon juice','Salt, pepper, red pepper flakes'],
    steps:['Toast bread.','Mash avocado with lemon juice, salt, and pepper.','Spread on toast. Add red pepper flakes if desired.'],
    benefit:'Avocados provide healthy fats that support brain function.', isCustom:false },

  { id:'r4',  name:'Walnut Trail Mix',         category:'Snack', prepTime:'2 min',
    ingredients:['¼ cup walnuts','¼ cup almonds','2 tbsp dark chocolate chips','2 tbsp dried cranberries'],
    steps:['Combine all ingredients in a small bowl or bag.'],
    benefit:'Walnuts are among the best nuts for brain health, high in DHA.', isCustom:false },

  { id:'r5',  name:'Turmeric Golden Milk',     category:'Drink', prepTime:'5 min',
    ingredients:['1 cup warm milk (any type)','½ tsp turmeric','¼ tsp cinnamon','1 tsp honey','Pinch of black pepper'],
    steps:['Warm milk gently — do not boil.','Whisk in turmeric, cinnamon, honey, and pepper.','Serve warm.'],
    benefit:'Curcumin in turmeric has anti-inflammatory properties linked to brain health.', isCustom:false },

  { id:'r6',  name:'Egg & Veggie Scramble',   category:'Breakfast', prepTime:'10 min',
    ingredients:['2 eggs','¼ cup diced bell pepper','¼ cup spinach','1 tbsp olive oil','Salt and pepper'],
    steps:['Sauté pepper in olive oil 2 min.','Add spinach, cook 1 min.','Add beaten eggs, scramble until set.'],
    benefit:'Eggs contain choline, important for memory and brain function.', isCustom:false },

  { id:'r7',  name:'Lentil Soup',             category:'Lunch', prepTime:'30 min',
    ingredients:['1 cup red lentils','1 carrot diced','1 celery stalk diced','1 tsp cumin','4 cups vegetable broth','Salt'],
    steps:['Combine all in pot.','Bring to boil, simmer 20 min until lentils are soft.','Season with salt.'],
    benefit:'Lentils provide folate and iron, supporting healthy blood flow to the brain.', isCustom:false },

  { id:'r8',  name:'Greek Yogurt Parfait',    category:'Snack', prepTime:'3 min',
    ingredients:['½ cup plain Greek yogurt','2 tbsp granola','¼ cup strawberries sliced','1 tsp honey'],
    steps:['Layer yogurt, granola, and strawberries in a bowl.','Drizzle with honey.'],
    benefit:'Probiotics in yogurt support the gut-brain connection.', isCustom:false },

  { id:'r9',  name:'Baked Sweet Potato',      category:'Lunch', prepTime:'45 min',
    ingredients:['1 medium sweet potato','1 tbsp olive oil','Salt and pepper','Optional: cinnamon and honey'],
    steps:['Preheat oven to 400°F.','Pierce potato, rub with olive oil and salt.','Bake 40 min until tender.'],
    benefit:'Sweet potatoes are high in beta-carotene, which reduces oxidative stress in the brain.', isCustom:false },

  { id:'r10', name:'Spinach & Berry Smoothie', category:'Drink', prepTime:'5 min',
    ingredients:['1 cup spinach','½ cup frozen mixed berries','1 banana','1 cup almond milk','1 tbsp flaxseed'],
    steps:['Add all ingredients to blender.','Blend until smooth. Add more milk if too thick.'],
    benefit:'Flaxseed provides ALA omega-3s; berries offer anthocyanins linked to memory support.', isCustom:false },
]
```

---

## The 15 Modules

### 1. ICE Contacts
Contact cards with photo (stored as base64), name, role, tap-to-call (`<a href="tel:...">`), tap-to-email, notes. ICE-tagged contacts pinned to top. Always accessible from top bar orange button.

### 2. Medication Manager
Full prescription list with time-slot checklist. Missed-dose check runs on module render (see data model). History log view filtered by date.

**// INTEGRATION POINT:** Missed dose caregiver notification. When a slot is detected as missed, call `sendMissedDoseAlert(medication, slot, caregiver)`. Implement using **EmailJS** (client-side, no backend needed — consistent with local-first constraint). Requires user to configure EmailJS public key and template ID in Settings. Twilio would require a backend relay and is NOT recommended for this app.

### 3. Calendar
Monthly view (grid) + weekly view (list). Event types and colors as defined in data model. Upcoming 3 events shown on home dashboard. Large, readable date cells — monthly grid uses abbreviated day headers (Mon, Tue…) and large date numbers.

### 4. Password Manager
PIN-gated on entry. If `ng_profile.pin` is null and module is enabled, show PIN setup modal before first access. Categories: WiFi, Streaming, Email, Other. Passwords `type="password"`, tap "Reveal" to toggle `type="text"`. Local-only disclaimer always visible at top of module.

### 5. Food & Grocery Hub
Default links seeded: DoorDash, Instacart, Grubhub, Meals on Wheels. User can add custom links. Saved order text notes. Pantry checklist — default items seeded: Bread, Milk, Eggs, Butter, Bananas, Yogurt, Juice, Coffee/Tea.

### 6. Bills & Banking
Bills list. Due-day compared to current date — within 7 days → amber badge "Due soon". Bank quick-links (user-added). "Always verify transactions directly with your bank." disclaimer always shown.

### 7. Brain Fitness Puzzles
Daily rotation based on `new Date().getDate() % 4`. All 4 types implemented:
- **Word scramble:** Pick from a 50-word list in `seed.js`, shuffle letters, user types answer
- **Word search:** 8×8 grid, 5 hidden words, tap cells to select
- **Memory match:** 4×4 grid, 8 emoji pairs, flip animation
- **Trivia:** One question per day from a 30-question pool in `seed.js`

Streak stored in `ng_puzzle_streak`. Warm completion message on finish.

### 8. Calm & Wellness Media
Default links seeded: Insight Timer, Calm, Libby/OverDrive, Audible. User can add/label/remove links. Links open in new tab.

### 9. Doctor's Notes
Notes list sorted by date desc. Rich-text body (use `contenteditable` div). Optional prompt toggle: "What did the doctor say? Any new medications? Follow-up date?" Search filters notes by keyword match in body, provider, or location. Browser `window.print()` triggers print dialog.

### 10. Recipe Book
10 pre-loaded from seed. Filter buttons: All / Breakfast / Lunch / Dinner / Snack / Drink. User can add custom recipes (`isCustom: true`). Recipe card shows name, prep time, ingredients, numbered steps, benefit note.

### 11. Transportation Links
Default links: Uber, Lyft. User can add local paratransit name + phone + optional URL. Notes field for instructions (e.g. "Call 24 hours ahead").

### 12. Community & Social
Entries with name, address, phone, URL, schedule, notes. User can add custom entries. No defaults seeded — fully user-populated.

### 13. Helplines & Support
Pre-loaded from seed (see Seed Data). 911 and Poison Control displayed first with larger buttons. All phones are `<a href="tel:...">`. User can add local numbers or edit blanks. Never deletable (only editable) to prevent accidental removal.

### 14. Loved Ones' Birthdays
Birthday list. On each home screen render, check for birthdays within 3 days — show amber status pill. On birthday: show warm message. One-tap email button opens `mailto:` with subject "Happy Birthday!" and body pre-filled. Optional Hallmark/American Greetings link per entry.

### 15. Pet Care
Pet profiles. Feeding times checklist (same pattern as medication time slots — morning/midday/evening). Walk schedule as text notes. `vetNotes` free text field. `appointments[]` array for vet appointments (same shape as `ng_events` entries). If Calendar module is enabled, a "Add to Calendar" button creates a calendar event.

---

## Settings Panel

- Module toggles — enabling Password Manager when `pin` is null triggers PIN setup modal
- Font size: Medium (18px base) / Large (22px base) / Extra Large (26px base) — applied via CSS custom property `--font-base` on `<body>`
- Theme: Light / Dark / High Contrast — applied via `data-theme` on `<body>`
- Profile edit: name, photo (upload → store as base64), diagnosis
- Caregiver alert assignment: contacts list with `isMedMonitor` checkbox
- Export data: serialize all `ng_*` keys to JSON blob, trigger download
- Reset all data: confirmation dialog, then clear all `ng_*` localStorage keys and redirect to `#onboarding`

---

## Accessibility

**ARIA landmark structure for `index.html`:**
```html
<header role="banner">       <!-- top bar -->
<nav aria-label="Modules">   <!-- module tile grid -->
<main id="main-content">     <!-- active section content -->
<dialog>                     <!-- modals (PIN entry, confirm dialogs) -->
```

- All `<button>` elements: `aria-label` if icon-only
- All form inputs: `<label>` elements, not placeholder-only
- Modal dialogs: `role="dialog"`, `aria-modal="true"`, focus trapped inside (Tab cycles within)
- Skip link: `<a href="#main-content" class="skip-link">Skip to content</a>` as first child of `<body>`, visible on focus
- Minimum tap targets: 48×48px enforced via `min-height`/`min-width` in CSS
- WCAG AA contrast: all defined color pairings meet 4.5:1 for normal text. Teal `#2a8a8a` on cream `#f0ece4` = ~4.6:1 (passing)
- `prefers-reduced-motion`: wrap all transitions in `@media (prefers-reduced-motion: no-preference)` — especially the memory card flip and puzzle animations
- No time-pressured interactions anywhere — no countdowns, no auto-dismiss

---

## Competition Notes

- **Hook:** Bold digital clock + "Good morning, Richard" loads in milliseconds — judges are emotionally engaged in the first 5 seconds
- **Story:** Built with dignity for people navigating neurological illness — memorable and meaningful
- **Breadth:** 15 working modules demonstrates full vision
- **Polish:** Morning Calm theme consistent throughout; seed data means the app is immediately demo-able without any setup
- **Demo tip:** Pre-populate a profile named "Richard" with several medications, a calendar event, and a birthday 2 days away to show all status pills active on first load

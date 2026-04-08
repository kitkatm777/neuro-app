# NeuroGateway Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build NeuroGateway — a 15-module, local-first personal patient gateway for neurological illness patients — as a polished, competition-ready multi-file vanilla JS app.

**Architecture:** Hash-based single-page app with no build step. `index.html` contains all `<section>` views; `app.js` routes between them by toggling visibility on `hashchange`. All data lives in `localStorage`. No framework, no npm, no backend.

**Tech Stack:** HTML5, CSS3 custom properties, vanilla ES6 JavaScript, Lucide icons (CDN), localStorage, EmailJS (CDN, integration point only)

---

## File Map

| File | Responsibility |
|------|---------------|
| `index.html` | Shell: top bar, all 15 `<section>` views + onboarding, script/link tags |
| `css/main.css` | Design tokens, global layout, typography, themes (light/dark/high-contrast), accessibility |
| `css/modules.css` | Per-module component styles |
| `js/storage.js` | `get(key)`, `set(key, val)`, `push(key, item)`, `remove(key, id)`, `update(key, id, patch)` helpers |
| `js/seed.js` | Pre-populated helplines array, recipes array, pantry defaults array |
| `js/clock.js` | `startClock()` — updates `#clock-time`, `#clock-day`, `#clock-date` every second |
| `js/app.js` | Init, hash router, onboarding gate, top-bar ICE button, settings toggle |
| `js/modules/home.js` | Status row computation, module tile grid render |
| `js/modules/ice-contacts.js` | ICE contacts CRUD, photo upload, ICE modal |
| `js/modules/medications.js` | Prescription CRUD, daily checklist, missed-dose detection, log view |
| `js/modules/calendar.js` | Event CRUD, monthly grid, weekly list, upcoming-events list |
| `js/modules/passwords.js` | PIN gate, password CRUD, reveal toggle |
| `js/modules/food.js` | Link CRUD, saved-order notes, pantry checklist |
| `js/modules/bills.js` | Bill CRUD, due-soon detection, bank link CRUD |
| `js/modules/puzzles.js` | Word scramble, word search, memory match, trivia — daily rotation + streak |
| `js/modules/wellness.js` | Wellness link CRUD |
| `js/modules/doctors-notes.js` | Note CRUD, search, print |
| `js/modules/recipes.js` | Recipe list + filter, custom recipe CRUD |
| `js/modules/transportation.js` | Transport link CRUD |
| `js/modules/community.js` | Community entry CRUD |
| `js/modules/helplines.js` | Helpline list, edit (no delete), add custom |
| `js/modules/birthdays.js` | Birthday CRUD, email greeting |
| `js/modules/pets.js` | Pet CRUD, feeding checklist, vet notes |
| `js/modules/settings.js` | Module toggles, font size, theme, profile edit, export, reset |
| `js/modules/settings.js` | Module toggles, font size, theme, profile edit, export, reset |

---

## Task 1: Project Scaffold

**Files:**
- Create: `index.html`
- Create: `css/main.css`
- Create: `css/modules.css`
- Create: `js/storage.js`
- Create: `js/seed.js`

- [ ] Create the folder structure:
```
neuro-app/
├── index.html
├── css/
│   ├── main.css
│   └── modules.css
└── js/
    ├── app.js
    ├── clock.js
    ├── storage.js
    ├── seed.js
    └── modules/
```

- [ ] Write `css/main.css` — design tokens + global resets:
```css
:root {
  --bg: #f0ece4;
  --surface: #ffffff;
  --primary: #2c5f7a;
  --secondary: #4a7c59;
  --accent: #c07830;
  --teal: #2a8a8a;
  --text: #2a2a2a;
  --text-muted: #666666;
  --border: #e0ddd6;
  --band-blue: #2c5f7a;
  --band-green: #4a7c59;
  --band-amber: #c07830;
  --band-teal: #2a8a8a;
  --font-base: 18px;
  --radius: 16px;
  --focus: 3px solid #2c5f7a;
}

[data-theme="dark"] {
  --bg: #0f1d2e;
  --surface: #1a2f45;
  --text: #e8d5a3;
  --text-muted: #a0b8c8;
  --border: #2a4560;
}

[data-theme="high-contrast"] {
  --bg: #000000;
  --surface: #111111;
  --text: #ffffff;
  --text-muted: #cccccc;
  --primary: #ffff00;
  --border: #ffffff;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: var(--font-base);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

/* Font size variants */
[data-fontsize="large"]  { --font-base: 22px; }
[data-fontsize="xl"]     { --font-base: 26px; }

/* Skip link */
.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  background: var(--primary);
  color: white;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 700;
  z-index: 9999;
  transition: top 0.2s;
}
.skip-link:focus { top: 0; }

/* Focus visible */
:focus-visible { outline: var(--focus); outline-offset: 3px; }

/* Top bar */
.topbar {
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 56px;
  position: sticky;
  top: 0;
  z-index: 100;
}
.topbar-title { font-size: 20px; font-weight: 700; }
.topbar-right { display: flex; gap: 10px; }
.btn-ice {
  background: #e05c1a;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  min-height: 48px;
}
.btn-settings {
  background: rgba(255,255,255,0.15);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 15px;
  cursor: pointer;
  min-height: 48px;
}

/* Sections */
section { display: none; padding-bottom: 40px; }
section.active { display: block; }

/* Cards */
.card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: 0 2px 12px rgba(44,95,122,0.10);
  margin: 16px 20px;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: var(--font-base);
  font-weight: 600;
  cursor: pointer;
  border: none;
  min-height: 48px;
  min-width: 48px;
}
.btn-primary { background: var(--primary); color: white; }
.btn-secondary { background: var(--secondary); color: white; }
.btn-ghost { background: transparent; border: 2px solid var(--primary); color: var(--primary); }
.btn-danger { background: #c0392b; color: white; }

/* Form inputs */
label { display: block; font-weight: 600; margin-bottom: 6px; font-size: var(--font-base); }
input, textarea, select {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid var(--border);
  border-radius: 10px;
  font-size: var(--font-base);
  background: var(--surface);
  color: var(--text);
  margin-bottom: 16px;
  min-height: 48px;
}
input:focus, textarea:focus, select:focus {
  outline: var(--focus);
  border-color: var(--primary);
}

/* Module heading */
.module-heading {
  font-size: 26px;
  font-weight: 700;
  color: var(--primary);
  padding: 24px 20px 8px;
}

/* Back button */
.btn-back {
  margin: 16px 20px 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: var(--primary);
  font-size: var(--font-base);
  font-weight: 600;
  cursor: pointer;
  padding: 8px 0;
}

/* Tap-target minimum */
button, a[role="button"], .module-tile { min-height: 48px; min-width: 48px; }

/* Status pills */
.status-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  border: 1.5px solid transparent;
  flex: 1;
  min-width: 160px;
}
.pill-ok     { background: #e8f5e9; color: #2e6b3e; border-color: #a5d6a7; }
.pill-warn   { background: #fff3e0; color: #b45309; border-color: #ffcc80; }
.pill-info   { background: #e3f2fd; color: #1a5276; border-color: #90caf9; }
.pill-alert  { background: #fce4ec; color: #b71c1c; border-color: #ef9a9a; }

/* Reduced motion */
@media (prefers-reduced-motion: no-preference) {
  .module-tile { transition: transform 0.15s, box-shadow 0.15s; }
  .module-tile:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(44,95,122,0.16); }
}
```

- [ ] Write `js/storage.js`:
```js
const Storage = {
  get(key) {
    try { return JSON.parse(localStorage.getItem(key)) ?? null; }
    catch { return null; }
  },
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },
  getArray(key) {
    const val = this.get(key);
    return Array.isArray(val) ? val : [];
  },
  push(key, item) {
    const arr = this.getArray(key);
    arr.push(item);
    this.set(key, arr);
  },
  remove(key, id) {
    const arr = this.getArray(key).filter(i => i.id !== id);
    this.set(key, arr);
  },
  update(key, id, patch) {
    const arr = this.getArray(key).map(i => i.id === id ? { ...i, ...patch } : i);
    this.set(key, arr);
  },
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
};
```

- [ ] Write `js/seed.js` — paste helplines and recipes arrays exactly from spec (section "Seed Data"). Add pantry defaults:
```js
const Seed = {
  helplines: [ /* paste 7 entries from spec */ ],
  recipes:   [ /* paste 10 entries from spec */ ],
  pantry:    [
    { id:'p1', item:'Bread', have:true },
    { id:'p2', item:'Milk', have:true },
    { id:'p3', item:'Eggs', have:true },
    { id:'p4', item:'Butter', have:true },
    { id:'p5', item:'Bananas', have:false },
    { id:'p6', item:'Yogurt', have:false },
    { id:'p7', item:'Juice', have:true },
    { id:'p8', item:'Coffee/Tea', have:true },
  ],
  foodLinks: [
    { id:'fl1', label:'DoorDash',        url:'https://www.doordash.com' },
    { id:'fl2', label:'Instacart',       url:'https://www.instacart.com' },
    { id:'fl3', label:'Grubhub',         url:'https://www.grubhub.com' },
    { id:'fl4', label:'Meals on Wheels', url:'https://www.mealsonwheelsamerica.org' },
  ],
  wellnessLinks: [
    { id:'wl1', label:'Insight Timer', url:'https://insighttimer.com' },
    { id:'wl2', label:'Calm',          url:'https://www.calm.com' },
    { id:'wl3', label:'Libby / OverDrive', url:'https://libbyapp.com' },
    { id:'wl4', label:'Audible',       url:'https://www.audible.com' },
  ],
  apply() {
    if (!Storage.get('ng_helplines'))     Storage.set('ng_helplines',     this.helplines);
    if (!Storage.get('ng_recipes'))       Storage.set('ng_recipes',       this.recipes);
    if (!Storage.get('ng_pantry'))        Storage.set('ng_pantry',        this.pantry);
    if (!Storage.get('ng_food_links'))    Storage.set('ng_food_links',    this.foodLinks);
    if (!Storage.get('ng_wellness_links'))Storage.set('ng_wellness_links',this.wellnessLinks);
  }
};
```

- [ ] Create `css/modules.css` as an empty file (styles added per module task).

- [ ] Create `index.html` skeleton:
```html
<!DOCTYPE html>
<html lang="en" data-theme="light" data-fontsize="medium">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NeuroGateway</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/modules.css">
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to content</a>

  <header role="banner" class="topbar">
    <span class="topbar-title">NeuroGateway</span>
    <nav class="topbar-right" aria-label="Quick actions">
      <button class="btn-ice" id="btn-ice" aria-label="ICE Emergency Contacts">🚨 ICE Contacts</button>
      <button class="btn-settings" id="btn-settings" aria-label="Open settings">⚙ Settings</button>
    </nav>
  </header>

  <main id="main-content">
    <!-- sections inserted here in subsequent tasks -->
  </main>

  <script src="js/storage.js"></script>
  <script src="js/seed.js"></script>
  <script src="js/clock.js"></script>
  <!-- module scripts inserted in subsequent tasks -->
  <script src="js/app.js"></script>
</body>
</html>
```

- [ ] Open `index.html` in browser — page loads with blue top bar, no errors in console.

- [ ] Commit:
```bash
git init
git add index.html css/ js/storage.js js/seed.js
git commit -m "feat: project scaffold — shell, tokens, storage helpers, seed data"
```

---

## Task 2: Clock + App Router

**Files:**
- Create: `js/clock.js`
- Create: `js/app.js`
- Modify: `index.html` — add `#onboarding` and `#home` sections

- [ ] Write `js/clock.js`:
```js
function startClock() {
  function update() {
    const now = new Date();
    const h = now.getHours(), m = now.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    const min = String(m).padStart(2, '0');
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const el = id => document.getElementById(id);
    if (el('clock-time')) el('clock-time').textContent = `${hour}:${min}`;
    if (el('clock-ampm')) el('clock-ampm').textContent = ampm;
    if (el('clock-day'))  el('clock-day').textContent  = days[now.getDay()];
    if (el('clock-date')) el('clock-date').textContent = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  }
  update();
  setInterval(update, 1000);
}
```

- [ ] Write `js/app.js` — router + init:
```js
const SECTIONS = [
  'onboarding','home','ice-contacts','medications','calendar',
  'passwords','food','bills','puzzles','wellness','doctors-notes',
  'recipes','transportation','community','helplines','birthdays',
  'pets','settings'
];

function showSection(id) {
  SECTIONS.forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.toggle('active', s === id);
  });
}

function route() {
  const hash = location.hash.replace('#', '') || 'home';
  const target = SECTIONS.includes(hash) ? hash : 'home';
  showSection(target);
  // Call module render function if it exists
  const renderFn = window[`render_${target.replace(/-/g,'_')}`];
  if (typeof renderFn === 'function') renderFn();
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function init() {
  const profile = Storage.get('ng_profile');
  if (!profile) {
    showSection('onboarding');
    if (typeof render_onboarding === 'function') render_onboarding();
    return;
  }
  // Apply saved theme and font size
  document.documentElement.setAttribute('data-theme', profile.theme || 'light');
  document.documentElement.setAttribute('data-fontsize', profile.fontSize || 'medium');
  Seed.apply();
  startClock();
  window.addEventListener('hashchange', route);
  document.getElementById('btn-ice').addEventListener('click', () => location.hash = '#ice-contacts');
  document.getElementById('btn-settings').addEventListener('click', () => location.hash = '#settings');
  route();
}

document.addEventListener('DOMContentLoaded', init);
```

- [ ] Add `#onboarding` section to `index.html` inside `<main>` (onboarding content added in Task 3).
- [ ] Add `#home` section placeholder to `index.html`:
```html
<section id="home">
  <div class="card" style="margin:20px;border-left:6px solid var(--primary)">
    <div style="font-size:80px;font-weight:800;color:var(--primary);font-family:Georgia,serif;line-height:1">
      <span id="clock-time">--:--</span><sup id="clock-ampm" style="font-size:28px;font-weight:400;margin-left:6px">--</sup>
    </div>
    <div id="clock-day" style="font-size:26px;color:var(--secondary);font-weight:700;margin-top:6px"></div>
    <div id="clock-date" style="font-size:19px;color:var(--text-muted);margin-top:2px"></div>
    <div id="home-greeting" style="font-size:22px;color:var(--primary);font-weight:600;margin-top:14px;padding-top:14px;border-top:1px solid var(--border)"></div>
  </div>
  <div id="home-status-row" style="display:flex;gap:10px;margin:0 20px 16px;flex-wrap:wrap"></div>
  <div style="font-size:13px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;margin:0 20px 10px">My Modules</div>
  <nav id="home-module-grid" aria-label="Modules" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:0 20px 30px"></nav>
</section>
```

- [ ] Open `index.html` — because no profile exists, `#onboarding` shows (empty for now). No console errors.
- [ ] Commit:
```bash
git add js/clock.js js/app.js index.html
git commit -m "feat: hash router, clock, app init"
```

---

## Task 3: Onboarding Wizard

**Files:**
- Modify: `index.html` — fill `#onboarding` section
- Create: `js/modules/onboarding.js`
- Modify: `index.html` — add script tag for onboarding.js before app.js

- [ ] Add `#onboarding` HTML to `index.html`:
```html
<section id="onboarding">
  <div class="card" style="margin:40px 20px;max-width:540px">
    <div id="onboarding-step-1">
      <h2 style="font-size:28px;color:var(--primary);margin-bottom:8px">Welcome to NeuroGateway</h2>
      <p style="color:var(--text-muted);margin-bottom:24px">Your personal daily life hub. Let's get you set up.</p>
      <label for="ob-name">Your name</label>
      <input id="ob-name" type="text" placeholder="e.g. Richard" autocomplete="given-name">
      <label for="ob-diagnosis">Condition (optional)</label>
      <input id="ob-diagnosis" type="text" placeholder="e.g. Parkinson's disease">
      <button class="btn btn-primary" id="ob-next-1" style="width:100%">Next →</button>
    </div>
    <div id="onboarding-step-2" style="display:none">
      <h2 style="font-size:24px;color:var(--primary);margin-bottom:8px">Choose your modules</h2>
      <p style="color:var(--text-muted);margin-bottom:16px">You can change these anytime in Settings.</p>
      <div id="ob-module-list" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px"></div>
      <button class="btn btn-primary" id="ob-next-2" style="width:100%">Next →</button>
    </div>
    <div id="onboarding-step-3" style="display:none">
      <h2 style="font-size:24px;color:var(--primary);margin-bottom:8px">Set a PIN for Passwords</h2>
      <p style="color:var(--text-muted);margin-bottom:16px">4-digit PIN to protect your saved passwords.</p>
      <label for="ob-pin">4-digit PIN</label>
      <input id="ob-pin" type="password" maxlength="4" inputmode="numeric" placeholder="••••">
      <button class="btn btn-primary" id="ob-finish" style="width:100%">Get Started</button>
      <button class="btn btn-ghost" id="ob-skip-pin" style="width:100%;margin-top:8px">Skip — I won't use Passwords</button>
    </div>
  </div>
</section>
```

- [ ] Write `js/modules/onboarding.js`:
```js
const ALL_MODULES = [
  { id:'medications',    label:'💊 Medications',      defaultOn:true },
  { id:'calendar',       label:'📅 Calendar',          defaultOn:true },
  { id:'ice-contacts',   label:'👤 ICE Contacts',      defaultOn:true },
  { id:'helplines',      label:'📞 Helplines',         defaultOn:true },
  { id:'doctors-notes',  label:'📝 Doctor\'s Notes',   defaultOn:true },
  { id:'passwords',      label:'🔑 Passwords',         defaultOn:false },
  { id:'food',           label:'🛒 Food & Grocery',    defaultOn:false },
  { id:'bills',          label:'💳 Bills & Banking',   defaultOn:false },
  { id:'puzzles',        label:'🧩 Brain Puzzles',     defaultOn:false },
  { id:'wellness',       label:'🌿 Calm & Wellness',   defaultOn:false },
  { id:'recipes',        label:'🍳 Recipe Book',       defaultOn:false },
  { id:'transportation', label:'🚗 Transportation',    defaultOn:false },
  { id:'community',      label:'🏘️ Community',         defaultOn:false },
  { id:'birthdays',      label:'🎂 Birthdays',         defaultOn:false },
  { id:'pets',           label:'🐾 Pet Care',          defaultOn:false },
];

let obName = '', obDiagnosis = '', obModules = [];

function render_onboarding() {
  // Step 1 — name
  document.getElementById('ob-next-1').addEventListener('click', () => {
    obName = document.getElementById('ob-name').value.trim();
    if (!obName) { alert('Please enter your name.'); return; }
    obDiagnosis = document.getElementById('ob-diagnosis').value.trim();
    document.getElementById('onboarding-step-1').style.display = 'none';
    document.getElementById('onboarding-step-2').style.display = 'block';
    renderModuleCheckboxes();
  });

  // Step 2 — modules
  document.getElementById('ob-next-2').addEventListener('click', () => {
    obModules = ALL_MODULES.filter(m => document.getElementById(`ob-mod-${m.id}`)?.checked).map(m => m.id);
    if (obModules.length === 0) { alert('Please select at least one module.'); return; }
    if (obModules.includes('passwords')) {
      document.getElementById('onboarding-step-2').style.display = 'none';
      document.getElementById('onboarding-step-3').style.display = 'block';
    } else {
      finishOnboarding(null);
    }
  });

  // Step 3 — PIN
  document.getElementById('ob-finish').addEventListener('click', () => {
    const pin = document.getElementById('ob-pin').value;
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) { alert('Please enter a 4-digit PIN.'); return; }
    finishOnboarding(pin);
  });
  document.getElementById('ob-skip-pin').addEventListener('click', () => finishOnboarding(null));
}

function renderModuleCheckboxes() {
  const container = document.getElementById('ob-module-list');
  container.innerHTML = ALL_MODULES.map(m => `
    <label style="display:flex;align-items:center;gap:8px;font-weight:normal;cursor:pointer;padding:8px;background:var(--bg);border-radius:8px">
      <input type="checkbox" id="ob-mod-${m.id}" ${m.defaultOn ? 'checked' : ''}
        style="width:20px;height:20px;cursor:pointer;accent-color:var(--primary);margin-bottom:0">
      ${m.label}
    </label>
  `).join('');
}

function finishOnboarding(pin) {
  const profile = {
    name: obName,
    diagnosis: obDiagnosis,
    enabledModules: obModules,
    pin,
    fontSize: 'medium',
    theme: 'light',
    photo: null
  };
  Storage.set('ng_profile', profile);
  Seed.apply();
  location.reload(); // clean init with profile in place
}
```

- [ ] Add `<script src="js/modules/onboarding.js"></script>` to `index.html` before `app.js`.
- [ ] Open browser — complete onboarding with name "Richard", select a few modules, skip PIN. App reloads and shows `#home` (empty for now). No console errors.
- [ ] Commit:
```bash
git add js/modules/onboarding.js index.html
git commit -m "feat: 3-step onboarding wizard"
```

---

## Task 4: Home Dashboard

**Files:**
- Create: `js/modules/home.js`
- Modify: `index.html` — add home.js script tag
- Modify: `css/modules.css` — module tile styles

- [ ] Add module tile styles to `css/modules.css`:
```css
.module-tile {
  background: var(--surface);
  border-radius: 16px;
  padding: 18px 12px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 10px rgba(44,95,122,0.09);
  cursor: pointer;
  border: none;
  border-bottom: 3px solid transparent;
  text-decoration: none;
  color: var(--text);
  min-height: 90px;
  width: 100%;
}
.module-tile .tile-icon { font-size: 28px; }
.module-tile .tile-label { font-size: 13px; font-weight: 700; text-align: center; line-height: 1.2; }
.band-blue  { border-bottom-color: var(--band-blue); }
.band-green { border-bottom-color: var(--band-green); }
.band-amber { border-bottom-color: var(--band-amber); }
.band-teal  { border-bottom-color: var(--band-teal); }
```

- [ ] Write `js/modules/home.js`:
```js
const MODULE_TILES = [
  { id:'medications',   label:'Medications',    icon:'💊', band:'blue' },
  { id:'calendar',      label:'Calendar',       icon:'📅', band:'blue' },
  { id:'ice-contacts',  label:'ICE Contacts',   icon:'👤', band:'blue' },
  { id:'recipes',       label:'Recipe Book',    icon:'🍳', band:'blue' },
  { id:'puzzles',       label:'Brain Puzzles',  icon:'🧩', band:'green' },
  { id:'wellness',      label:'Calm & Wellness',icon:'🌿', band:'green' },
  { id:'doctors-notes', label:"Doctor's Notes", icon:'📝', band:'green' },
  { id:'birthdays',     label:'Birthdays',      icon:'🎂', band:'green' },
  { id:'food',          label:'Food & Grocery', icon:'🛒', band:'amber' },
  { id:'bills',         label:'Bills & Banking',icon:'💳', band:'amber' },
  { id:'passwords',     label:'Passwords',      icon:'🔑', band:'amber' },
  { id:'pets',          label:'Pet Care',       icon:'🐾', band:'amber' },
  { id:'transportation',label:'Transportation', icon:'🚗', band:'teal' },
  { id:'community',     label:'Community',      icon:'🏘️', band:'teal' },
  { id:'helplines',     label:'Helplines',      icon:'📞', band:'teal' },
];

function render_home() {
  const profile = Storage.get('ng_profile');
  if (!profile) return;

  // Greeting
  document.getElementById('home-greeting').textContent =
    `${getGreeting()}, ${profile.name} ☀️`;

  // Status row
  renderStatusRow(profile);

  // Module grid — only enabled modules
  const grid = document.getElementById('home-module-grid');
  const enabled = profile.enabledModules || [];
  grid.innerHTML = MODULE_TILES
    .filter(t => enabled.includes(t.id))
    .map(t => `
      <a href="#${t.id}" class="module-tile band-${t.band}" aria-label="${t.label}">
        <span class="tile-icon">${t.icon}</span>
        <span class="tile-label">${t.label}</span>
      </a>
    `).join('');
}

function renderStatusRow(profile) {
  const row = document.getElementById('home-status-row');
  const pills = [];

  // Medication status
  const meds = Storage.getArray('ng_medications');
  if (meds.length > 0 && (profile.enabledModules||[]).includes('medications')) {
    const now = new Date();
    const today = now.toISOString().slice(0,10);
    const log = Storage.getArray('ng_med_log').filter(l => l.date === today && l.taken);
    const totalToday = meds.reduce((n, m) => n + (m.schedule||[]).filter(s => {
      const [h] = (s.time||'00:00').split(':').map(Number);
      return h <= now.getHours();
    }).length, 0);
    const taken = log.length;
    if (taken >= totalToday && totalToday > 0) {
      pills.push(`<div class="status-pill pill-ok">✓ Medications on track</div>`);
    } else if (totalToday > 0) {
      pills.push(`<div class="status-pill pill-warn">⚠ ${totalToday - taken} dose(s) due</div>`);
    }
  }

  // Next calendar event
  if ((profile.enabledModules||[]).includes('calendar')) {
    const events = Storage.getArray('ng_events')
      .filter(e => e.date >= new Date().toISOString().slice(0,10))
      .sort((a,b) => a.date.localeCompare(b.date));
    if (events.length > 0) {
      const e = events[0];
      const d = new Date(e.date + 'T00:00:00');
      const day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
      pills.push(`<div class="status-pill pill-info">📅 ${e.title} · ${day} ${e.time||''}</div>`);
    }
  }

  // Birthday alert (within 3 days)
  if ((profile.enabledModules||[]).includes('birthdays')) {
    const today = new Date();
    const bd = Storage.getArray('ng_birthdays').find(b => {
      const [,m,d] = b.date.split('-').map(Number);
      const next = new Date(today.getFullYear(), m-1, d);
      if (next < today) next.setFullYear(today.getFullYear()+1);
      const diff = Math.ceil((next - today) / 86400000);
      return diff <= 3;
    });
    if (bd) {
      const [,m,d] = bd.date.split('-').map(Number);
      const next = new Date(today.getFullYear(), m-1, d);
      const diff = Math.ceil((next - today) / 86400000);
      const msg = diff === 0 ? `🎂 Happy Birthday, ${bd.name}!` : `🎂 ${bd.name}'s birthday in ${diff} day${diff>1?'s':''}`;
      pills.push(`<div class="status-pill pill-warn">${msg}</div>`);
    }
  }

  row.innerHTML = pills.join('');
}
```

- [ ] Add `<script src="js/modules/home.js"></script>` to `index.html` before `app.js`.
- [ ] Open browser. Home shows clock ticking, "Good morning/afternoon/evening, Richard", and module tiles for enabled modules. Click a tile — hash updates (section empty for now — that's fine).
- [ ] Commit:
```bash
git add js/modules/home.js css/modules.css index.html
git commit -m "feat: home dashboard — clock, greeting, status row, module grid"
```

---

## Task 5: ICE Contacts

**Files:**
- Create: `js/modules/ice-contacts.js`
- Modify: `index.html` — add `#ice-contacts` section + script tag

- [ ] Add `#ice-contacts` section to `index.html`:
```html
<section id="ice-contacts">
  <button class="btn-back" onclick="history.back()" aria-label="Go back">← Back</button>
  <h1 class="module-heading">ICE Contacts</h1>
  <div style="padding:0 20px 12px">
    <button class="btn btn-primary" id="ice-add-btn" aria-label="Add new contact">+ Add Contact</button>
  </div>
  <div id="ice-list"></div>

  <dialog id="ice-modal" aria-modal="true" aria-label="Contact details" style="border-radius:16px;border:none;padding:0;width:min(540px,95vw);max-height:90vh;overflow-y:auto">
    <div style="padding:24px">
      <h2 style="font-size:22px;color:var(--primary);margin-bottom:16px" id="ice-modal-title">Add Contact</h2>
      <input type="hidden" id="ice-id">
      <label for="ice-name">Full Name *</label><input id="ice-name" type="text" required>
      <label for="ice-role">Relationship / Role *</label><input id="ice-role" type="text" placeholder="e.g. Daughter, Neurologist">
      <label for="ice-phone">Phone</label><input id="ice-phone" type="tel">
      <label for="ice-email">Email</label><input id="ice-email" type="email">
      <label for="ice-notes">Notes</label><textarea id="ice-notes" rows="3" style="resize:vertical"></textarea>
      <label style="display:flex;align-items:center;gap:8px;margin-bottom:16px;font-weight:normal;cursor:pointer">
        <input type="checkbox" id="ice-is-ice" style="width:20px;height:20px;accent-color:var(--primary);margin-bottom:0">
        Mark as ICE (In Case of Emergency)
      </label>
      <label style="display:flex;align-items:center;gap:8px;margin-bottom:20px;font-weight:normal;cursor:pointer">
        <input type="checkbox" id="ice-is-monitor" style="width:20px;height:20px;accent-color:var(--primary);margin-bottom:0">
        Notify for missed medications
      </label>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-primary" id="ice-save-btn" style="flex:1">Save</button>
        <button class="btn btn-ghost" id="ice-cancel-btn" style="flex:1">Cancel</button>
        <button class="btn btn-danger" id="ice-delete-btn" style="flex:1;display:none">Delete</button>
      </div>
    </div>
  </dialog>
</section>
```

- [ ] Write `js/modules/ice-contacts.js`:
```js
function render_ice_contacts() {
  renderIceList();
  document.getElementById('ice-add-btn').onclick = () => openIceModal(null);
  document.getElementById('ice-save-btn').onclick = saveIceContact;
  document.getElementById('ice-cancel-btn').onclick = closeIceModal;
  document.getElementById('ice-delete-btn').onclick = deleteIceContact;
}

function renderIceList() {
  const contacts = Storage.getArray('ng_contacts');
  const list = document.getElementById('ice-list');
  if (contacts.length === 0) {
    list.innerHTML = `<p style="padding:20px;color:var(--text-muted)">No contacts yet. Add your first contact above.</p>`;
    return;
  }
  // ICE contacts first
  const sorted = [...contacts].sort((a,b) => (b.isICE?1:0) - (a.isICE?1:0));
  list.innerHTML = sorted.map(c => `
    <div class="card" style="margin:8px 20px;display:flex;align-items:center;gap:16px">
      <div style="width:56px;height:56px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;color:white;font-size:22px;font-weight:700;flex-shrink:0">
        ${c.name.charAt(0).toUpperCase()}
      </div>
      <div style="flex:1;min-width:0">
        <div style="font-size:18px;font-weight:700">${c.name}${c.isICE?' <span style="background:#e05c1a;color:white;border-radius:6px;padding:2px 8px;font-size:12px;margin-left:6px">ICE</span>':''}</div>
        <div style="color:var(--text-muted);font-size:15px">${c.role}</div>
        ${c.phone ? `<a href="tel:${c.phone}" class="btn btn-primary" style="margin-top:8px;padding:8px 14px;font-size:14px;display:inline-flex" aria-label="Call ${c.name}">📞 Call</a>` : ''}
        ${c.email ? `<a href="mailto:${c.email}" class="btn btn-ghost" style="margin-top:8px;margin-left:8px;padding:8px 14px;font-size:14px;display:inline-flex" aria-label="Email ${c.name}">✉ Email</a>` : ''}
      </div>
      <button class="btn btn-ghost" style="padding:8px 12px" onclick="openIceModal('${c.id}')" aria-label="Edit ${c.name}">Edit</button>
    </div>
  `).join('');
}

function openIceModal(id) {
  const modal = document.getElementById('ice-modal');
  const c = id ? Storage.getArray('ng_contacts').find(x => x.id === id) : null;
  document.getElementById('ice-modal-title').textContent = c ? 'Edit Contact' : 'Add Contact';
  document.getElementById('ice-id').value = id || '';
  document.getElementById('ice-name').value = c?.name || '';
  document.getElementById('ice-role').value = c?.role || '';
  document.getElementById('ice-phone').value = c?.phone || '';
  document.getElementById('ice-email').value = c?.email || '';
  document.getElementById('ice-notes').value = c?.notes || '';
  document.getElementById('ice-is-ice').checked = c?.isICE || false;
  document.getElementById('ice-is-monitor').checked = c?.isMedMonitor || false;
  document.getElementById('ice-delete-btn').style.display = c ? 'block' : 'none';
  modal.showModal();
  document.getElementById('ice-name').focus();
}

function closeIceModal() { document.getElementById('ice-modal').close(); }

function saveIceContact() {
  const name = document.getElementById('ice-name').value.trim();
  if (!name) { alert('Name is required.'); return; }
  const id = document.getElementById('ice-id').value;
  const contact = {
    id: id || Storage.uid(),
    name,
    role: document.getElementById('ice-role').value.trim(),
    phone: document.getElementById('ice-phone').value.trim(),
    email: document.getElementById('ice-email').value.trim(),
    notes: document.getElementById('ice-notes').value.trim(),
    isICE: document.getElementById('ice-is-ice').checked,
    isMedMonitor: document.getElementById('ice-is-monitor').checked,
    photo: null
  };
  if (id) Storage.update('ng_contacts', id, contact);
  else Storage.push('ng_contacts', contact);
  closeIceModal();
  renderIceList();
}

function deleteIceContact() {
  const id = document.getElementById('ice-id').value;
  if (!id || !confirm('Delete this contact?')) return;
  Storage.remove('ng_contacts', id);
  closeIceModal();
  renderIceList();
}
```

- [ ] Add script tag + section to `index.html`.
- [ ] Verify: navigate to `#ice-contacts`, add a contact, it appears in the list. Edit and delete work. ICE badge shows when checked.
- [ ] Commit:
```bash
git add js/modules/ice-contacts.js index.html
git commit -m "feat: ICE contacts module — CRUD, call/email links, ICE badge"
```

---

## Task 6: Medication Manager

**Files:**
- Create: `js/modules/medications.js`
- Modify: `index.html` — add `#medications` section + script tag

- [ ] Add `#medications` section to `index.html` (two sub-views: list and daily checklist via tab buttons):
```html
<section id="medications">
  <button class="btn-back" onclick="history.back()">← Back</button>
  <h1 class="module-heading">Medications</h1>
  <div style="display:flex;gap:10px;padding:0 20px 16px">
    <button class="btn btn-primary" id="med-tab-today" aria-pressed="true">Today's Doses</button>
    <button class="btn btn-ghost" id="med-tab-list">My Prescriptions</button>
    <button class="btn btn-ghost" id="med-tab-log">History Log</button>
  </div>
  <div id="med-view-today"></div>
  <div id="med-view-list" style="display:none">
    <div style="padding:0 20px 12px"><button class="btn btn-primary" id="med-add-btn">+ Add Prescription</button></div>
    <div id="med-prescription-list"></div>
  </div>
  <div id="med-view-log" style="display:none">
    <div id="med-log-view"></div>
  </div>

  <dialog id="med-modal" aria-modal="true" aria-label="Prescription details" style="border-radius:16px;border:none;padding:0;width:min(580px,95vw);max-height:90vh;overflow-y:auto">
    <div style="padding:24px">
      <h2 style="font-size:22px;color:var(--primary);margin-bottom:16px" id="med-modal-title">Add Prescription</h2>
      <input type="hidden" id="med-id">
      <label for="med-brand">Brand Name *</label><input id="med-brand" type="text" required>
      <label for="med-generic">Generic Name</label><input id="med-generic" type="text">
      <label for="med-dosage">Dosage (e.g. 10mg)</label><input id="med-dosage" type="text">
      <label for="med-form">Form</label>
      <select id="med-form" style="margin-bottom:16px">
        <option>Tablet</option><option>Capsule</option><option>Liquid</option><option>Patch</option><option>Other</option>
      </select>
      <label for="med-instructions">Instructions</label><input id="med-instructions" type="text" placeholder="e.g. Take with food">
      <label for="med-desc">Pill description</label><input id="med-desc" type="text" placeholder="e.g. round white tablet, imprinted M5">
      <fieldset style="border:1px solid var(--border);border-radius:10px;padding:16px;margin-bottom:16px">
        <legend style="font-weight:700;padding:0 8px">Schedule</legend>
        <div id="med-schedule-fields"></div>
        <button type="button" class="btn btn-ghost" id="med-add-slot" style="margin-top:8px">+ Add Time Slot</button>
      </fieldset>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-primary" id="med-save-btn" style="flex:1">Save</button>
        <button class="btn btn-ghost" id="med-cancel-btn" style="flex:1">Cancel</button>
        <button class="btn btn-danger" id="med-delete-btn" style="display:none;flex:1">Delete</button>
      </div>
    </div>
  </dialog>
</section>
```

- [ ] Write `js/modules/medications.js` — implement:
  - `render_medications()` — sets up tabs, calls `renderTodayView()`
  - `renderTodayView()` — groups schedule slots by time-of-day, renders large checkboxes per dose, marks missed (>60min past with no log entry) in amber
  - `renderPrescriptionList()` — cards with brand/generic/dosage/instructions
  - `renderLogView()` — last 14 days, each day showing taken/missed per slot
  - Modal CRUD for prescriptions
  - Schedule slot builder in modal (add/remove rows: slot dropdown + time input)
  - `checkDose(medId, slot, date)` — writes to `ng_med_log`, re-renders
  - `detectMissedDoses()` — returns array of `{med, slot}` missed today

  ```js
  // INTEGRATION POINT: Missed dose caregiver notification
  // When detectMissedDoses() finds a missed dose, call sendMissedDoseAlert()
  // Implement using EmailJS (client-side, no backend needed):
  //   emailjs.send(serviceId, templateId, { to_email: caregiver.email, med_name, slot, patient_name })
  // Configure: user sets EmailJS public key + template ID in Settings panel
  // Until configured, log to console only.
  function sendMissedDoseAlert(med, slot, caregiver) {
    console.log('[INTEGRATION POINT] Missed dose alert:', med.brandName, slot, '->', caregiver.email);
    // emailjs.send(...) goes here
  }
  ```

- [ ] Verify: add a prescription with a morning slot. Today's view shows it. Check it off — pill turns green. Uncheck — turns back. Navigate to History Log — today's entry appears.
- [ ] Commit:
```bash
git add js/modules/medications.js index.html
git commit -m "feat: medication manager — prescriptions, daily checklist, log, missed-dose hook"
```

---

## Task 7: Calendar

**Files:**
- Create: `js/modules/calendar.js`
- Modify: `index.html`

- [ ] Add `#calendar` section with month/week tab buttons and event modal.
- [ ] Write `js/modules/calendar.js`:
  - `render_calendar()` — default to monthly view
  - `renderMonthView(year, month)` — 7-column grid, large date numbers. Events shown as colored dots/tags below date. Prev/Next month buttons.
  - `renderWeekView()` — list of events for current week, grouped by day
  - Event modal — fields: title, date, time, type (dropdown: Medical Appointment/Social Obligation/Visitor Coming/At-Home Care/Personal Reminder), location, notes
  - Event type color map: `{ 'Medical Appointment':'#2c5f7a', 'Social Obligation':'#4a7c59', 'Visitor Coming':'#c07830', 'At-Home Care / Aide Visit':'#2a8a8a', 'Personal Reminder':'#7a5c3a' }`
  - CRUD for events
- [ ] Verify: add a Medical Appointment event. It appears on the monthly grid as a blue tag. Switch to weekly view — appears in list. Home screen status pill shows next event.
- [ ] Commit:
```bash
git add js/modules/calendar.js index.html
git commit -m "feat: calendar — monthly/weekly views, 5 event types, CRUD"
```

---

## Task 8: Password Manager

**Files:**
- Create: `js/modules/passwords.js`
- Modify: `index.html`

- [ ] Add `#passwords` section with PIN gate overlay and password list.
- [ ] Write `js/modules/passwords.js`:
  - `render_passwords()` — check `ng_profile.pin`. If null, show PIN setup modal. Else show PIN entry overlay.
  - PIN entry: 4 large digit buttons + backspace. On correct PIN, slide overlay away and show list.
  - If `pin` is null and module is now enabled: show "Set a PIN" modal (4-digit input), save to profile.
  - Password list grouped by category (WiFi / Streaming / Email / Other)
  - Each entry: label, username (optional), password (hidden, "👁 Reveal" toggle), notes
  - CRUD modal for entries
  - Disclaimer banner: "🔒 Passwords are stored on this device only. Never shared or synced."
- [ ] Verify: navigate to `#passwords`, PIN prompt appears, enter correct PIN, list shows. Add a WiFi entry. Password hidden by default, tap Reveal shows it.
- [ ] Commit:
```bash
git add js/modules/passwords.js index.html
git commit -m "feat: password manager — PIN gate, category list, reveal toggle"
```

---

## Task 9: Food & Grocery Hub

**Files:**
- Create: `js/modules/food.js`
- Modify: `index.html`

- [ ] Add `#food` section.
- [ ] Write `js/modules/food.js`:
  - Default links seeded in `Seed.apply()`: DoorDash, Instacart, Grubhub, Meals on Wheels — each opens in new tab
  - Large link buttons rendered from `ng_food_links`
  - "+ Add Link" opens a simple modal (label + URL)
  - "Saved Orders" — a `<textarea>` that auto-saves on blur to a `ng_food_notes` key
  - Pantry checklist — renders `ng_pantry` as large checkboxes; toggle `have` field on click; "+ Add Item" button
- [ ] Seed DoorDash/Instacart/Grubhub/MOW links in `Seed.apply()` if `ng_food_links` is empty.
- [ ] Verify: page loads with 4 default links. Click one — opens new tab. Add custom link. Pantry checklist toggles state and persists on reload.
- [ ] Commit:
```bash
git add js/modules/food.js index.html
git commit -m "feat: food & grocery hub — links, saved orders, pantry checklist"
```

---

## Task 10: Bills & Banking

**Files:**
- Create: `js/modules/bills.js`
- Modify: `index.html`

- [ ] Add `#bills` section.
- [ ] Write `js/modules/bills.js`:
  - Bills list: each card shows name, due day, amount (optional), "Due soon" amber badge if within 7 days of month's due date
  - CRUD modal for bills
  - Bank links section: user-added name + URL, opens new tab
  - Disclaimer: "Always verify transactions directly with your bank." — sticky banner at top
  - Due-soon logic: `const today = new Date().getDate(); const daysUntil = dueDay >= today ? dueDay - today : (daysInMonth - today + dueDay); return daysUntil <= 7;`
- [ ] Verify: add a bill due on day 10 of month. If within 7 days, amber badge shows. Add bank link, click opens new tab.
- [ ] Commit:
```bash
git add js/modules/bills.js index.html
git commit -m "feat: bills & banking — due-soon detection, bank links, disclaimer"
```

---

## Task 11: Brain Fitness Puzzles

**Files:**
- Create: `js/modules/puzzles.js`
- Modify: `index.html`
- Modify: `js/seed.js` — add word list and trivia questions

- [ ] Add word list (50 words, 5–8 letters) and trivia pool (30 questions) to `seed.js`:
```js
// In Seed object:
wordList: ['BRIDGE','CANDLE','GARDEN','JUNGLE','CASTLE','PLANET','MARKET','FOREST','SILVER','BUTTER',...], // 50 words
trivia: [
  { q:'What is the largest ocean on Earth?', a:'Pacific' },
  { q:'How many sides does a hexagon have?', a:'Six' },
  // ... 28 more gentle general-knowledge questions
]
```

- [ ] Write `js/modules/puzzles.js`:
  - `render_puzzles()` — determine today's puzzle type: `['scramble','wordsearch','memory','trivia'][new Date().getDate() % 4]`. Show selector buttons so user can also pick manually.
  - **Word Scramble:** pick word from list using day-of-year as index, shuffle letters, show scrambled, text input for answer, "Check" button, warm success message.
  - **Word Search:** generate 8×8 grid, place 5 words (horizontal/vertical), fill blanks with random letters. Tap-to-select cells, highlight matched words.
  - **Memory Match:** 8 emoji pairs in a 4×4 grid. Click to flip. Match = stay face up. All matched = celebration message. No timer.
  - **Trivia:** show question, 4 multiple-choice options (1 correct + 3 random). Select answer → reveal result with explanation.
  - Streak: on puzzle completion, update `ng_puzzle_streak` with today's date and increment if consecutive day.
  - Completion message (all types): `"Great work, [name]! Your brain is getting a workout. 🧠"` in a styled banner.
- [ ] Verify: each puzzle type works without errors. Streak increments on completion. Selecting a different puzzle type works.
- [ ] Commit:
```bash
git add js/modules/puzzles.js js/seed.js index.html
git commit -m "feat: brain fitness puzzles — scramble, word search, memory match, trivia, streak"
```

---

## Task 12: Calm & Wellness Media

**Files:**
- Create: `js/modules/wellness.js`
- Modify: `index.html`

- [ ] Add `#wellness` section.
- [ ] Write `js/modules/wellness.js`:
  - Seed default links if `ng_wellness_links` empty: Insight Timer, Calm, Libby/OverDrive, Audible — each with URL + label
  - Render large-button links opening in new tab
  - "+ Add Link" modal (label + URL)
  - Delete button on each link
- [ ] Verify: 4 default links shown. Add a custom link. Delete works.
- [ ] Commit:
```bash
git add js/modules/wellness.js index.html
git commit -m "feat: calm & wellness — curated links, add/remove custom links"
```

---

## Task 13: Doctor's Notes

**Files:**
- Create: `js/modules/doctors-notes.js`
- Modify: `index.html`

- [ ] Add `#doctors-notes` section.
- [ ] Write `js/modules/doctors-notes.js`:
  - Notes list sorted by date descending, each showing date + provider name
  - Click note → expand to full view with body, location, print button (`window.print()`)
  - "+ New Note" — modal with: date (default today), provider name, location, contenteditable body div
  - Optional prompts toggle: shows "What did the doctor say? Any new medications? Follow-up date?" as placeholder text
  - Search bar: filters notes by keyword in body/provider/location
  - CRUD (edit and delete)
- [ ] Verify: add a note with today's date. Appears in list. Search for a word in the body — filters correctly. Print button opens browser print dialog.
- [ ] Commit:
```bash
git add js/modules/doctors-notes.js index.html
git commit -m "feat: doctor's notes — CRUD, search, print, optional prompts"
```

---

## Task 14: Recipe Book

**Files:**
- Create: `js/modules/recipes.js`
- Modify: `index.html`

- [ ] Add `#recipes` section.
- [ ] Write `js/modules/recipes.js`:
  - Filter buttons: All / Breakfast / Lunch / Dinner / Snack / Drink — filter `ng_recipes` by category
  - Recipe cards: name, prep time, brain-health benefit note, expandable ingredients + steps
  - "+ Add Recipe" modal — all fields from spec schema
  - Custom recipes have a small "Custom" badge; pre-loaded recipes cannot be deleted (only custom ones can)
- [ ] Verify: 10 pre-loaded recipes show. Filter to "Breakfast" — shows only breakfast recipes. Add a custom recipe, it appears with Custom badge and can be deleted.
- [ ] Commit:
```bash
git add js/modules/recipes.js index.html
git commit -m "feat: recipe book — 10 seeded brain-healthy recipes, filter, custom add"
```

---

## Task 15: Transportation, Community, Helplines

**Files:**
- Create: `js/modules/transportation.js`
- Create: `js/modules/community.js`
- Create: `js/modules/helplines.js`
- Modify: `index.html`

- [ ] Write `js/modules/transportation.js`:
  - Seed Uber + Lyft links on first run
  - Large link buttons (open new tab) + optional phone stored per entry
  - "+ Add Service" modal (label, URL optional, phone optional, notes)
  - Notes field shown below each entry

- [ ] Write `js/modules/community.js`:
  - No defaults — fully user-populated
  - Entry CRUD: name, address, phone, URL, schedule, notes
  - Each entry displayed as a card with tap-to-call and tap-to-visit buttons

- [ ] Write `js/modules/helplines.js`:
  - Load from `ng_helplines` (seeded from `Seed.apply()`)
  - 911 and Poison Control rendered first with larger, more prominent buttons
  - All phones are `<a href="tel:...">` buttons
  - Entries are editable (to fill in blank phone numbers) but NOT deletable — use "Edit" modal, no delete button
  - "+ Add Helpline" for custom entries (these ARE deletable)

- [ ] Verify: Helplines shows 911 prominently at top, tap-to-call links work. Transportation shows Uber/Lyft by default. Community starts empty, add an entry.
- [ ] Commit:
```bash
git add js/modules/transportation.js js/modules/community.js js/modules/helplines.js index.html
git commit -m "feat: transportation, community, helplines modules"
```

---

## Task 16: Birthdays & Pet Care

**Files:**
- Create: `js/modules/birthdays.js`
- Create: `js/modules/pets.js`
- Modify: `index.html`

- [ ] Write `js/modules/birthdays.js`:
  - Birthday list with name, relationship, date, email (optional)
  - Each entry: "Send Birthday Email" button → opens `mailto:contact@email.com?subject=Happy Birthday!&body=Wishing you a wonderful birthday!`
  - Link to Hallmark.com shown below each entry with stored email
  - On render, checks for birthdays within 3 days and surfaces a warm banner at top of module

- [ ] Write `js/modules/pets.js`:
  - Pet profiles CRUD: name, species, breed, vetContact, vetNotes
  - Feeding times checklist per pet (same slot pattern as medications: morning/midday/evening)
  - Walk schedule as free-text notes field
  - `appointments[]` array: upcoming vet appointments shown as a list, each with date/time/notes
  - If Calendar module enabled in profile, "Add to Calendar" button on each appointment creates an `ng_events` entry

- [ ] Verify: add a birthday 2 days from now → home status pill shows warning. Email button opens mail client. Add a pet with feeding slots → checklist appears.
- [ ] Commit:
```bash
git add js/modules/birthdays.js js/modules/pets.js index.html
git commit -m "feat: birthdays (email greeting, 3-day alert) and pet care (profiles, feeding checklist)"
```

---

## Task 17: Settings Panel

**Files:**
- Create: `js/modules/settings.js`
- Modify: `index.html`

- [ ] Add `#settings` section.
- [ ] Write `js/modules/settings.js`:
  - **Profile:** name input, diagnosis input, photo upload (FileReader → base64 → `ng_profile.photo`), save button
  - **Font Size:** 3 large radio buttons: Medium (18px) / Large (22px) / Extra Large (26px) — on change, set `data-fontsize` on `<html>` and save to profile
  - **Theme:** 3 radio buttons: Light / Dark / High Contrast — on change, set `data-theme` on `<html>` and save to profile
  - **Module Toggles:** grid of all 15 modules with toggle switches. On enabling Passwords when `pin` is null, show PIN setup modal.
  - **Caregiver Alerts:** list of all contacts with `isMedMonitor` checkbox — updates `ng_contacts`
  - **Export Data:** serialize all `ng_*` localStorage keys to a JSON object, `Blob`, trigger download as `neurogateway-backup-YYYY-MM-DD.json`
  - **Reset All Data:** `confirm("This will delete all your data. Are you sure?")` → if yes, loop over all `ng_*` keys and `localStorage.removeItem`, then `location.reload()`

- [ ] Verify: change font size to Large — text grows across all sections. Switch to Dark theme — colors update. Export data — JSON file downloads. Reset — onboarding appears again.
- [ ] Commit:
```bash
git add js/modules/settings.js index.html
git commit -m "feat: settings — profile, font size, theme, module toggles, export, reset"
```

---

## Task 18: Accessibility & Polish Pass

**Files:**
- Modify: `index.html` — ARIA roles, skip link, dialog focus traps
- Modify: `css/main.css` — verify contrast, reduced-motion guard, focus styles
- Modify: all module JS files — verify ARIA labels on dynamic content

- [ ] Verify skip link is first element in `<body>`, visible on Tab press.
- [ ] Verify all `<dialog>` modals: add focus trap so Tab cycles only within dialog while open. Add `Escape` key handler to close. Add `aria-modal="true"` and `role="dialog"` to all dialogs. Use this pattern in each modal:
```js
function trapFocus(modal) {
  const focusable = modal.querySelectorAll('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');
  const first = focusable[0], last = focusable[focusable.length-1];
  modal.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    if (e.key === 'Escape') modal.close();
  });
}
```
Call `trapFocus(modal)` once after each `modal.showModal()`.

- [ ] Scan all module sections: every icon-only button has `aria-label`. Every input has an associated `<label>`. Every list has appropriate role if needed.
- [ ] Verify `@media (prefers-reduced-motion: no-preference)` wraps all CSS transitions in `main.css`.
- [ ] Check teal `#2a8a8a` on cream `#f0ece4` in browser dev tools — confirm contrast ≥ 4.5:1.
- [ ] Commit:
```bash
git add css/main.css index.html js/modules/
git commit -m "feat: accessibility pass — focus traps, ARIA labels, skip link, reduced-motion"
```

---

## Task 19: Demo Data & Final Polish

**Files:**
- Modify: `js/seed.js` — add `Seed.demoData()` helper
- Modify: `index.html` — final title, meta description

- [ ] Add `Seed.demoData()` to `seed.js` — populates realistic data for Richard so all status pills are active on first load:
```js
demoData() {
  // Only runs if no existing data
  if (Storage.getArray('ng_contacts').length > 0) return;

  // Add a contact (daughter, med monitor)
  Storage.push('ng_contacts', { id:'demo-c1', name:'Sarah Thompson', role:'Daughter', phone:'555-0191', email:'sarah@example.com', isICE:true, isMedMonitor:true, notes:'', photo:null });

  // Add a medication with morning slot
  Storage.push('ng_medications', { id:'demo-m1', brandName:'Carbidopa-Levodopa', genericName:'Sinemet', dosage:'25-100mg', form:'Tablet', instructions:'Take with food', schedule:[{slot:'morning',time:'08:00'},{slot:'evening',time:'18:00'}], pillPhoto:null, pillDescription:'yellow oval tablet', labelText:'' });

  // Add a calendar event (in 2 days)
  const apptDate = new Date(); apptDate.setDate(apptDate.getDate()+2);
  Storage.push('ng_events', { id:'demo-e1', title:'Dr. Okafor', date:apptDate.toISOString().slice(0,10), time:'14:00', type:'Medical Appointment', location:'Movement Disorder Clinic', notes:'Bring medication list', contactId:null });

  // Add a birthday (in 2 days)
  const bdDate = new Date(); bdDate.setDate(bdDate.getDate()+2);
  const bdStr = `2000-${String(bdDate.getMonth()+1).padStart(2,'0')}-${String(bdDate.getDate()).padStart(2,'0')}`;
  Storage.push('ng_birthdays', { id:'demo-b1', name:"Mom", relationship:'Mother', date:bdStr, email:'mom@example.com', photo:null });
},
```

- [ ] Call `Seed.demoData()` at end of `finishOnboarding()` in `onboarding.js` (after `Seed.apply()`).
- [ ] Final `index.html` polish: add `<meta name="description" content="NeuroGateway — Personal daily life hub for people living with neurological illness">` and favicon link.
- [ ] Open app fresh (reset data first via Settings, or open in private window). Complete onboarding as "Richard". Home screen should show: clock ticking, "Good morning, Richard", 3 status pills active (medication due, Dr. Okafor in 2 days, Mom's birthday in 2 days), module tiles for selected modules.
- [ ] Test all 15 modules navigate correctly from home tiles.
- [ ] Commit:
```bash
git add js/seed.js index.html js/modules/onboarding.js
git commit -m "feat: demo data seeding and final polish — competition-ready"
```

---

## Completion Checklist

- [ ] All 15 modules navigable from home grid
- [ ] Clock ticks live on home screen
- [ ] Onboarding wizard completes and stores profile
- [ ] Status pills show correctly for meds, calendar, birthday
- [ ] Medication checklist marks doses and detects missed ones
- [ ] ICE contacts accessible from top-bar orange button on every screen
- [ ] Password manager PIN gates correctly
- [ ] Brain puzzles — all 4 types work, streak increments
- [ ] Settings — font size, theme, module toggles all take effect immediately
- [ ] Export data downloads a valid JSON file
- [ ] Reset sends user back to onboarding
- [ ] Tab key navigates without getting trapped outside modals
- [ ] Escape key closes all modals
- [ ] App works offline (open `index.html` directly, no server)
- [ ] No console errors in any module

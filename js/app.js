// ── Sections ────────────────────────────────────────────────
const SECTIONS = [
  'onboarding','home','my-health','my-life','help-hub',
  'ice-contacts','medications','calendar',
  'passwords','food','bills','puzzles','wellness','doctors-notes',
  'recipes','transportation','community','helplines','birthdays',
  'pets','settings'
];

// ── Breadcrumb map ─────────────────────────────────────────
const BREADCRUMBS = {
  'home':          [],
  'my-health':     [['Home','#home'], ['My Health', null]],
  'my-life':       [['Home','#home'], ['My Life', null]],
  'help-hub':      [['Home','#home'], ['Help', null]],
  'medications':   [['Home','#home'], ['My Health','#my-health'], ['My Medicines', null]],
  'calendar':      [['Home','#home'], ['My Health','#my-health'], ['My Schedule', null]],
  'doctors-notes': [['Home','#home'], ['My Health','#my-health'], ['Doctor Visits', null]],
  'wellness':      [['Home','#home'], ['My Health','#my-health'], ['Calm & Rest', null]],
  'food':          [['Home','#home'], ['My Life','#my-life'], ['Food & Shopping', null]],
  'recipes':       [['Home','#home'], ['My Life','#my-life'], ['Recipes', null]],
  'bills':         [['Home','#home'], ['My Life','#my-life'], ['Bills & Money', null]],
  'passwords':     [['Home','#home'], ['My Life','#my-life'], ['Passwords', null]],
  'puzzles':       [['Home','#home'], ['My Life','#my-life'], ['Brain Games', null]],
  'birthdays':     [['Home','#home'], ['My Life','#my-life'], ['Birthdays', null]],
  'pets':          [['Home','#home'], ['My Life','#my-life'], ['My Pets', null]],
  'transportation':[['Home','#home'], ['My Life','#my-life'], ['Getting Around', null]],
  'community':     [['Home','#home'], ['My Life','#my-life'], ['Community', null]],
  'ice-contacts':  [['Home','#home'], ['Help','#help-hub'], ['Emergency Contacts', null]],
  'helplines':     [['Home','#home'], ['Help','#help-hub'], ['Helplines', null]],
  'settings':      [['Home','#home'], ['Settings', null]],
};

// ── Bottom nav parent map ──────────────────────────────────
const BNAV_PARENT = {
  'home':          'home',
  'my-health':     'health',
  'medications':   'health',
  'calendar':      'health',
  'doctors-notes': 'health',
  'wellness':      'health',
  'my-life':       'life',
  'food':          'life',
  'recipes':       'life',
  'bills':         'life',
  'passwords':     'life',
  'puzzles':       'life',
  'birthdays':     'life',
  'pets':          'life',
  'transportation':'life',
  'community':     'life',
  'help-hub':      'help',
  'ice-contacts':  'help',
  'helplines':     'help',
};

// ── Show section ───────────────────────────────────────────
function showSection(id) {
  SECTIONS.forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.toggle('active', s === id);
  });
  updateBreadcrumb(id);
  updateBottomNav(id);
  window.scrollTo(0, 0);
}

// ── Breadcrumb ─────────────────────────────────────────────
function updateBreadcrumb(id) {
  const el = document.getElementById('breadcrumb');
  if (!el) return;
  const crumbs = BREADCRUMBS[id] || [];
  if (!crumbs.length) {
    el.classList.remove('visible');
    el.innerHTML = '';
    return;
  }
  el.classList.add('visible');
  el.innerHTML = crumbs.map((c, i) => {
    const isLast = i === crumbs.length - 1;
    const sep = i > 0 ? '<span class="crumb-sep" aria-hidden="true">›</span>' : '';
    if (isLast || !c[1]) return `${sep}<span aria-current="page">${c[0]}</span>`;
    return `${sep}<a href="${c[1]}">${c[0]}</a>`;
  }).join('');
}

// ── Bottom nav active state ────────────────────────────────
function updateBottomNav(id) {
  const parent = BNAV_PARENT[id] || 'home';
  ['home','health','life','help'].forEach(tab => {
    const el = document.getElementById('bnav-' + tab);
    if (el) el.classList.toggle('active', tab === parent);
  });
}

// ── Router ─────────────────────────────────────────────────
function route() {
  const hash = location.hash.replace('#', '') || 'home';
  const target = SECTIONS.includes(hash) ? hash : 'home';
  showSection(target);
  const renderFn = window[`render_${target.replace(/-/g, '_')}`];
  if (typeof renderFn === 'function') renderFn();
}

// ── Greeting ───────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ── Init ───────────────────────────────────────────────────
function init() {
  let profile = Storage.get('ng_profile');
  if (!profile) {
    profile = {
      name: 'Richard',
      diagnosis: '',
      pin: null,
      theme: 'light',
      fontSize: 'medium',
      enabledModules: [
        'medications','calendar','ice-contacts','helplines','doctors-notes',
        'passwords','food','bills','puzzles','wellness','recipes',
        'transportation','community','birthdays','pets'
      ]
    };
    Storage.set('ng_profile', profile);
    Seed.apply();
    Seed.demoData();
  }
  document.documentElement.setAttribute('data-theme',   profile.theme    || 'light');
  document.documentElement.setAttribute('data-fontsize', profile.fontSize || 'medium');
  Seed.apply();
  startClock();
  window.addEventListener('hashchange', route);
  document.getElementById('btn-ice').addEventListener('click',      () => { location.hash = '#ice-contacts'; });
  document.getElementById('btn-settings').addEventListener('click', () => { location.hash = '#settings'; });
  route();
}

document.addEventListener('DOMContentLoaded', init);

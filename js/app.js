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
  document.documentElement.setAttribute('data-theme', profile.theme || 'light');
  document.documentElement.setAttribute('data-fontsize', profile.fontSize || 'medium');
  Seed.apply();
  startClock();
  window.addEventListener('hashchange', route);
  document.getElementById('btn-ice').addEventListener('click', () => { location.hash = '#ice-contacts'; });
  document.getElementById('btn-settings').addEventListener('click', () => { location.hash = '#settings'; });
  route();
}

document.addEventListener('DOMContentLoaded', init);

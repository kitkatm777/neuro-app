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

  document.getElementById('home-greeting').textContent =
    `${getGreeting()}, ${profile.name} ☀️`;

  renderStatusRow(profile);

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
  const enabled = profile.enabledModules || [];

  // Medication status
  if (enabled.includes('medications')) {
    const meds = Storage.getArray('ng_medications');
    if (meds.length > 0) {
      const now = new Date();
      const today = now.toISOString().slice(0,10);
      const log = Storage.getArray('ng_med_log').filter(l => l.date === today && l.taken);
      const totalToday = meds.reduce((n, m) => n + (m.schedule||[]).filter(s => {
        const [h] = (s.time||'00:00').split(':').map(Number);
        return h <= now.getHours();
      }).length, 0);
      if (totalToday > 0) {
        const taken = log.length;
        if (taken >= totalToday) {
          pills.push(`<div class="status-pill pill-ok">✓ Medications on track</div>`);
        } else {
          pills.push(`<div class="status-pill pill-warn">⚠ ${totalToday - taken} dose(s) due</div>`);
        }
      }
    }
  }

  // Next calendar event
  if (enabled.includes('calendar')) {
    const events = Storage.getArray('ng_events')
      .filter(e => e.date >= new Date().toISOString().slice(0,10))
      .sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time));
    if (events.length > 0) {
      const e = events[0];
      const d = new Date(e.date + 'T00:00:00');
      const day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
      pills.push(`<div class="status-pill pill-info">📅 ${e.title} · ${day} ${e.time||''}</div>`);
    }
  }

  // Birthday alert (within 3 days)
  if (enabled.includes('birthdays')) {
    const today = new Date();
    today.setHours(0,0,0,0);
    const bd = Storage.getArray('ng_birthdays').find(b => {
      const parts = b.date.split('-').map(Number);
      const next = new Date(today.getFullYear(), parts[1]-1, parts[2]);
      if (next < today) next.setFullYear(today.getFullYear()+1);
      const diff = Math.round((next - today) / 86400000);
      return diff >= 0 && diff <= 3;
    });
    if (bd) {
      const parts = bd.date.split('-').map(Number);
      const next = new Date(today.getFullYear(), parts[1]-1, parts[2]);
      if (next < today) next.setFullYear(today.getFullYear()+1);
      const diff = Math.round((next - today) / 86400000);
      const msg = diff === 0
        ? `🎂 Happy Birthday, ${bd.name}!`
        : `🎂 ${bd.name}'s birthday in ${diff} day${diff>1?'s':''}`;
      pills.push(`<div class="status-pill pill-warn">${msg}</div>`);
    }
  }

  row.innerHTML = pills.join('');
}

// Hub pages — My Health, My Life, Help

const HEALTH_TILES = [
  { id:'medications',   label:'My Medicines',   icon:'💊' },
  { id:'calendar',      label:'My Schedule',    icon:'📅' },
  { id:'doctors-notes', label:'Doctor Visits',  icon:'📋' },
  { id:'wellness',      label:'Calm & Rest',    icon:'🌿' },
];

const LIFE_TILES = [
  { id:'food',          label:'Food & Shopping', icon:'🛒' },
  { id:'recipes',       label:'Recipes',         icon:'🍲' },
  { id:'bills',         label:'Bills & Money',   icon:'💳' },
  { id:'passwords',     label:'Passwords',       icon:'🔑' },
  { id:'puzzles',       label:'Brain Games',     icon:'🧩' },
  { id:'birthdays',     label:'Birthdays',       icon:'🎂' },
  { id:'pets',          label:'My Pets',         icon:'🐾' },
  { id:'transportation',label:'Getting Around',  icon:'🚗' },
  { id:'community',     label:'Community',       icon:'🤝' },
];

const HELP_TILES = [
  { id:'ice-contacts',  label:'Emergency Contacts', icon:'🚨' },
  { id:'helplines',     label:'Helplines',           icon:'📞' },
];

function render_my_health() {
  renderHubGrid('hub-health-grid', HEALTH_TILES);
}

function render_my_life() {
  renderHubGrid('hub-life-grid', LIFE_TILES);
}

function render_help_hub() {
  renderHubGrid('hub-help-grid', HELP_TILES);

  // Also render the direct helplines list below the tiles
  const lines = Storage.getArray('ng_helplines');
  const el = document.getElementById('hub-help-lines');
  if (!el || !lines.length) return;

  el.innerHTML = `
    <div class="section-label" style="margin-top:8px">Quick Dial</div>
    <div class="card" style="background:#fce8e8;border-left:4px solid #8b1c1c;margin-bottom:12px">
      <p style="font-size:var(--font-base);color:#8b1c1c;font-weight:700;margin:0">
        In a life-threatening emergency, call <a href="tel:911" style="color:#8b1c1c;text-decoration:underline">911</a> right away.
      </p>
    </div>
    ${lines.slice(0, 4).map(h => `
      <div class="card" style="margin-bottom:12px">
        <div style="font-size:20px;font-weight:700;color:var(--primary);margin-bottom:6px">${h.name}</div>
        ${h.description ? `<div style="font-size:17px;color:var(--text-muted);margin-bottom:12px">${h.description}</div>` : ''}
        ${h.phone ? `<a href="tel:${h.phone.replace(/\D/g,'')}" class="btn btn-primary btn-full" style="text-decoration:none">📞 Call ${h.phone}</a>` : ''}
      </div>`).join('')}
    <div style="padding:0 0 8px">
      <a href="#helplines" class="btn btn-ghost btn-full" style="text-decoration:none">See all helplines →</a>
    </div>`;
}

function renderHubGrid(containerId, tiles) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const profile = Storage.get('ng_profile') || {};
  const enabled = profile.enabledModules || tiles.map(t => t.id);
  const visible = tiles.filter(t => enabled.includes(t.id));

  if (!visible.length) {
    el.innerHTML = `<div style="padding:20px;color:var(--text-muted);font-size:var(--font-base)">No modules enabled. Go to Settings to turn them on.</div>`;
    return;
  }

  el.innerHTML = visible.map(t => `
    <a href="#${t.id}" class="hub-tile" aria-label="Open ${t.label}">
      <span class="tile-icon">${t.icon}</span>
      <span class="tile-label">${t.label}</span>
    </a>`).join('');
}

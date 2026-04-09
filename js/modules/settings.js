// Task 17: Settings Panel
const ALL_SETTINGS_MODULES = [
  { id:'medications',    label:'💊 Medications' },
  { id:'calendar',       label:'📅 Calendar' },
  { id:'ice-contacts',   label:'🚨 ICE Contacts' },
  { id:'helplines',      label:'📞 Helplines' },
  { id:'doctors-notes',  label:'📋 Doctor\'s Notes' },
  { id:'passwords',      label:'🔑 Passwords' },
  { id:'food',           label:'🥦 Food & Grocery' },
  { id:'bills',          label:'💳 Bills & Banking' },
  { id:'puzzles',        label:'🧩 Brain Fitness' },
  { id:'wellness',       label:'🌿 Calm & Wellness' },
  { id:'recipes',        label:'🍲 Recipes' },
  { id:'transportation', label:'🚗 Transportation' },
  { id:'community',      label:'🤝 Community' },
  { id:'birthdays',      label:'🎂 Birthdays' },
  { id:'pets',           label:'🐾 Pet Care' }
];

function render_settings() {
  const el = document.getElementById('settings-content');
  if (!el) return;
  const profile = Storage.get('ng_profile') || {};
  const enabled = profile.enabledModules || [];
  const theme = profile.theme || 'light';
  const fontSize = profile.fontSize || 'medium';

  el.innerHTML = `
    <div style="padding:0 20px 40px;max-width:620px">

      <!-- Profile -->
      <div class="card" style="margin-bottom:20px">
        <h2 style="font-size:20px;color:var(--primary);margin-bottom:16px">👤 Your Profile</h2>
        <label for="s-name">Your Name</label>
        <input id="s-name" type="text" value="${escAttr(profile.name || '')}" placeholder="Your name">
        <label for="s-diagnosis">Condition (optional)</label>
        <input id="s-diagnosis" type="text" value="${escAttr(profile.diagnosis || '')}" placeholder="e.g. Parkinson's disease">
        <button class="btn btn-primary" style="width:100%" onclick="saveProfileSettings()">Save Profile</button>
      </div>

      <!-- Theme -->
      <div class="card" style="margin-bottom:20px">
        <h2 style="font-size:20px;color:var(--primary);margin-bottom:16px">🎨 Display Theme</h2>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
          ${['light','dark','high-contrast'].map(t => `
            <button class="btn ${theme===t?'btn-primary':'btn-ghost'}" id="theme-btn-${t}"
              onclick="applyTheme('${t}')" style="padding:14px 8px;font-size:15px">
              ${t==='light'?'☀️ Light':t==='dark'?'🌙 Dark':'⚡ High Contrast'}
            </button>`).join('')}
        </div>
      </div>

      <!-- Font Size -->
      <div class="card" style="margin-bottom:20px">
        <h2 style="font-size:20px;color:var(--primary);margin-bottom:16px">🔤 Text Size</h2>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
          ${[['medium','Normal'],['large','Large'],['xl','Very Large']].map(([sz,lbl]) => `
            <button class="btn ${fontSize===sz?'btn-primary':'btn-ghost'}" id="font-btn-${sz}"
              onclick="applyFontSize('${sz}')" style="padding:14px 8px;font-size:${sz==='medium'?'15px':sz==='large'?'18px':'22px'}">
              ${lbl}
            </button>`).join('')}
        </div>
      </div>

      <!-- PIN -->
      <div class="card" style="margin-bottom:20px">
        <h2 style="font-size:20px;color:var(--primary);margin-bottom:8px">🔒 Password PIN</h2>
        <p style="font-size:15px;color:var(--text-muted);margin-bottom:16px">
          ${profile.pin ? 'A PIN is set. You can change it below.' : 'No PIN set. Add one to protect your passwords.'}
        </p>
        <label for="s-pin">New 4-digit PIN</label>
        <input id="s-pin" type="password" maxlength="4" inputmode="numeric" placeholder="••••" style="letter-spacing:8px;font-size:22px">
        <button class="btn btn-primary" style="width:100%" onclick="savePinSetting()">
          ${profile.pin ? 'Change PIN' : 'Set PIN'}
        </button>
      </div>

      <!-- Modules -->
      <div class="card" style="margin-bottom:20px">
        <h2 style="font-size:20px;color:var(--primary);margin-bottom:8px">📱 My Modules</h2>
        <p style="font-size:15px;color:var(--text-muted);margin-bottom:16px">Choose which modules appear on your home screen.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
          ${ALL_SETTINGS_MODULES.map(m => `
            <label style="display:flex;align-items:center;gap:10px;font-size:16px;cursor:pointer;
              background:var(--bg);border-radius:10px;padding:10px 12px;border:2px solid ${enabled.includes(m.id)?'var(--primary)':'var(--border)'}">
              <input type="checkbox" id="mod-${m.id}" ${enabled.includes(m.id)?'checked':''}
                style="width:20px;height:20px;accent-color:var(--primary);margin-bottom:0;flex-shrink:0"
                onchange="updateModuleToggle('${m.id}',this.checked)">
              <span>${m.label}</span>
            </label>`).join('')}
        </div>
        <button class="btn btn-primary" style="width:100%" onclick="saveModuleSettings()">Save Module Choices</button>
      </div>

      <!-- Reset -->
      <div class="card" style="margin-bottom:20px;border-left:4px solid var(--danger,#d32f2f)">
        <h2 style="font-size:20px;color:#c62828;margin-bottom:8px">⚠️ Reset App</h2>
        <p style="font-size:15px;color:var(--text-muted);margin-bottom:16px">
          This will erase ALL your data — medications, contacts, notes, everything. This cannot be undone.
        </p>
        <button class="btn btn-danger" style="width:100%" onclick="confirmReset()">Reset Everything</button>
      </div>

    </div>`;
}

function escAttr(str) {
  return (str || '').replace(/"/g, '&quot;');
}

function saveProfileSettings() {
  const name = document.getElementById('s-name').value.trim();
  if (!name) { alert('Please enter your name.'); return; }
  const profile = Storage.get('ng_profile') || {};
  profile.name = name;
  profile.diagnosis = document.getElementById('s-diagnosis').value.trim();
  Storage.set('ng_profile', profile);
  showSettingsFeedback('✅ Profile saved!');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const profile = Storage.get('ng_profile') || {};
  profile.theme = theme;
  Storage.set('ng_profile', profile);
  ['light','dark','high-contrast'].forEach(t => {
    const btn = document.getElementById('theme-btn-'+t);
    if (btn) btn.className = 'btn ' + (t === theme ? 'btn-primary' : 'btn-ghost');
  });
}

function applyFontSize(sz) {
  document.documentElement.setAttribute('data-fontsize', sz);
  const profile = Storage.get('ng_profile') || {};
  profile.fontSize = sz;
  Storage.set('ng_profile', profile);
  ['medium','large','xl'].forEach(s => {
    const btn = document.getElementById('font-btn-'+s);
    if (btn) btn.className = 'btn ' + (s === sz ? 'btn-primary' : 'btn-ghost');
  });
}

function savePinSetting() {
  const pin = document.getElementById('s-pin').value.trim();
  if (!/^\d{4}$/.test(pin)) { alert('Please enter exactly 4 digits.'); return; }
  const profile = Storage.get('ng_profile') || {};
  profile.pin = pin;
  Storage.set('ng_profile', profile);
  document.getElementById('s-pin').value = '';
  showSettingsFeedback('✅ PIN updated!');
}

function updateModuleToggle(id, checked) {
  // visual feedback — actual save on button press
  const lbl = document.querySelector(`label[for="mod-${id}"]`) ||
    document.getElementById('mod-'+id)?.closest('label');
  if (lbl) lbl.style.borderColor = checked ? 'var(--primary)' : 'var(--border)';
}

function saveModuleSettings() {
  const enabled = ALL_SETTINGS_MODULES
    .filter(m => document.getElementById('mod-'+m.id)?.checked)
    .map(m => m.id);
  const profile = Storage.get('ng_profile') || {};
  profile.enabledModules = enabled;
  Storage.set('ng_profile', profile);
  showSettingsFeedback('✅ Modules saved!');
}

function confirmReset() {
  if (!confirm('Are you absolutely sure? ALL your data will be permanently deleted.')) return;
  if (!confirm('Last chance — tap OK to erase everything.')) return;
  Object.keys(localStorage).filter(k => k.startsWith('ng_')).forEach(k => localStorage.removeItem(k));
  location.reload();
}

function showSettingsFeedback(msg) {
  let fb = document.getElementById('settings-feedback');
  if (!fb) {
    fb = document.createElement('div');
    fb.id = 'settings-feedback';
    fb.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--primary);color:#fff;padding:12px 28px;border-radius:50px;font-size:17px;font-weight:700;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.25)';
    document.body.appendChild(fb);
  }
  fb.textContent = msg;
  fb.style.opacity = '1';
  clearTimeout(fb._t);
  fb._t = setTimeout(() => { fb.style.opacity = '0'; }, 2500);
}

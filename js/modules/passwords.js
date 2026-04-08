const PW_CATEGORIES = ['WiFi Networks','Streaming Services','Email','Other'];
let pwUnlocked = false;

function render_passwords() {
  pwUnlocked = false;
  const profile = Storage.get('ng_profile');
  const hasPin = profile?.pin;

  if (!hasPin) {
    showPinSetup();
  } else {
    showPinEntry();
  }
}

function showPinSetup() {
  document.getElementById('pw-content').innerHTML = `
    <div class="card" style="max-width:400px;margin:40px auto">
      <h2 style="font-size:22px;color:var(--primary);margin-bottom:8px">Set a PIN</h2>
      <p style="color:var(--text-muted);margin-bottom:20px">Choose a 4-digit PIN to protect your passwords.</p>
      <label for="pw-setup-pin">4-digit PIN</label>
      <input id="pw-setup-pin" type="password" maxlength="4" inputmode="numeric" placeholder="••••" style="font-size:32px;letter-spacing:8px;text-align:center">
      <button class="btn btn-primary" style="width:100%" onclick="saveNewPin()">Save PIN</button>
    </div>`;
}

function saveNewPin() {
  const pin = document.getElementById('pw-setup-pin').value;
  if (!/^\d{4}$/.test(pin)) { alert('Please enter exactly 4 digits.'); return; }
  const profile = Storage.get('ng_profile');
  Storage.set('ng_profile', { ...profile, pin });
  pwUnlocked = true;
  renderPasswordList();
}

function showPinEntry() {
  let entered = '';
  document.getElementById('pw-content').innerHTML = `
    <div class="card" style="max-width:360px;margin:40px auto;text-align:center">
      <div style="font-size:60px;margin-bottom:8px">🔒</div>
      <h2 style="font-size:22px;color:var(--primary);margin-bottom:8px">Enter Your PIN</h2>
      <div id="pw-dots" style="font-size:40px;letter-spacing:12px;margin:16px 0;min-height:60px">○○○○</div>
      <div id="pw-error" style="color:#c0392b;font-size:16px;min-height:24px;margin-bottom:8px"></div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:280px;margin:0 auto">
        ${[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(k => `
          <button onclick="pinKey('${k}')"
            style="min-height:72px;font-size:28px;font-weight:700;border-radius:12px;border:2px solid var(--border);background:var(--surface);cursor:pointer;color:var(--text)"
            ${k==='' ? 'disabled style="visibility:hidden"' : ''}
            aria-label="${k==='⌫'?'Backspace':k}">${k}</button>
        `).join('')}
      </div>
    </div>`;

  window.pinKey = (k) => {
    if (k === '⌫') { entered = entered.slice(0,-1); }
    else if (entered.length < 4 && k !== '') { entered += k; }
    const dots = '●'.repeat(entered.length) + '○'.repeat(4 - entered.length);
    document.getElementById('pw-dots').textContent = dots;
    if (entered.length === 4) {
      const profile = Storage.get('ng_profile');
      if (entered === profile?.pin) {
        pwUnlocked = true;
        renderPasswordList();
      } else {
        document.getElementById('pw-error').textContent = 'Incorrect PIN. Try again.';
        entered = '';
        document.getElementById('pw-dots').textContent = '○○○○';
      }
    }
  };
}

function renderPasswordList() {
  const passwords = Storage.getArray('ng_passwords');
  let html = `
    <div style="background:#e3f2fd;border:1px solid #90caf9;border-radius:12px;padding:14px 20px;margin:12px 20px;font-size:15px;color:#1a5276">
      🔒 Passwords are stored on <strong>this device only</strong>. Never shared or synced.
    </div>
    <div style="padding:0 20px 12px;display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-primary" id="pw-add-btn">+ Add Password</button>
    </div>`;

  PW_CATEGORIES.forEach(cat => {
    const catPws = passwords.filter(p => p.category === cat);
    if (catPws.length === 0) return;
    html += `<div style="padding:0 20px 4px;font-size:13px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px">${cat}</div>`;
    catPws.forEach(p => {
      html += `
        <div class="card" style="margin:6px 20px">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
            <div style="flex:1;min-width:0">
              <div style="font-size:18px;font-weight:700">${p.label}</div>
              ${p.username ? `<div style="color:var(--text-muted);font-size:15px">👤 ${p.username}</div>` : ''}
              <div style="display:flex;align-items:center;gap:8px;margin-top:6px;flex-wrap:wrap">
                <span id="pw-val-${p.id}" style="font-family:monospace;font-size:16px;letter-spacing:2px;background:var(--bg);padding:4px 10px;border-radius:6px">••••••••</span>
                <button onclick="toggleReveal('${p.id}','${p.password.replace(/'/g,"\\'")}','${p.label}')"
                  class="btn btn-ghost" style="padding:6px 12px;font-size:14px" aria-label="Reveal password for ${p.label}">👁 Reveal</button>
              </div>
              ${p.notes ? `<div style="color:var(--text-muted);font-size:14px;margin-top:4px">${p.notes}</div>` : ''}
            </div>
            <button class="btn btn-ghost" style="padding:8px 12px;flex-shrink:0" onclick="openPwModal('${p.id}')" aria-label="Edit ${p.label}">Edit</button>
          </div>
        </div>`;
    });
  });

  if (passwords.length === 0) {
    html += `<p style="padding:20px;color:var(--text-muted)">No passwords saved yet. Add your first one above.</p>`;
  }

  document.getElementById('pw-content').innerHTML = html;
  document.getElementById('pw-add-btn').onclick = () => openPwModal(null);
}

function toggleReveal(id, password, label) {
  const el = document.getElementById(`pw-val-${id}`);
  if (el.textContent === '••••••••') {
    el.textContent = password;
  } else {
    el.textContent = '••••••••';
  }
}

function openPwModal(id) {
  const modal = document.getElementById('pw-modal');
  const p = id ? Storage.getArray('ng_passwords').find(x => x.id === id) : null;
  document.getElementById('pw-modal-title').textContent = p ? 'Edit Password' : 'Add Password';
  document.getElementById('pw-id').value = id || '';
  document.getElementById('pw-label').value = p?.label || '';
  document.getElementById('pw-category').value = p?.category || PW_CATEGORIES[0];
  document.getElementById('pw-username').value = p?.username || '';
  document.getElementById('pw-password').value = p?.password || '';
  document.getElementById('pw-notes').value = p?.notes || '';
  document.getElementById('pw-delete-btn').style.display = p ? 'inline-flex' : 'none';
  modal.showModal();
  document.getElementById('pw-label').focus();
}

function closePwModal() { document.getElementById('pw-modal').close(); }

function savePwEntry() {
  const label = document.getElementById('pw-label').value.trim();
  const password = document.getElementById('pw-password').value;
  if (!label) { alert('Please enter a label (e.g. Home WiFi).'); return; }
  if (!password) { alert('Please enter the password.'); return; }
  const id = document.getElementById('pw-id').value;
  const entry = {
    id: id || Storage.uid(),
    label,
    category: document.getElementById('pw-category').value,
    username: document.getElementById('pw-username').value.trim(),
    password,
    notes: document.getElementById('pw-notes').value.trim()
  };
  if (id) Storage.update('ng_passwords', id, entry);
  else Storage.push('ng_passwords', entry);
  closePwModal();
  renderPasswordList();
}

function deletePwEntry() {
  const id = document.getElementById('pw-id').value;
  if (!id || !confirm('Delete this password entry?')) return;
  Storage.remove('ng_passwords', id);
  closePwModal();
  renderPasswordList();
}

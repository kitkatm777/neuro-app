const SLOTS = [
  { id:'morning',   label:'Morning',   emoji:'🌅' },
  { id:'afternoon', label:'Afternoon', emoji:'☀️' },
  { id:'evening',   label:'Evening',   emoji:'🌆' },
  { id:'bedtime',   label:'Bedtime',   emoji:'🌙' },
];

// ── Toast notification ─────────────────────────────────
let toastTimer = null;
function showToast(msg) {
  let el = document.getElementById('riley-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'riley-toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
}

function render_medications() {
  renderTodayView();
  setupMedTabs();
  document.getElementById('med-add-btn').onclick = () => openMedModal(null);
  document.getElementById('med-save-btn').onclick = saveMedication;
  document.getElementById('med-cancel-btn').onclick = closeMedModal;
  document.getElementById('med-delete-btn').onclick = deleteMedication;
  document.getElementById('med-add-slot').onclick = addScheduleSlot;
}

function setupMedTabs() {
  document.getElementById('med-tab-today').onclick = () => {
    showMedView('today');
    renderTodayView();
  };
  document.getElementById('med-tab-list').onclick = () => {
    showMedView('list');
    renderPrescriptionList();
  };
  document.getElementById('med-tab-log').onclick = () => {
    showMedView('log');
    renderLogView();
  };
}

function showMedView(view) {
  document.getElementById('med-view-today').style.display = view === 'today' ? 'block' : 'none';
  document.getElementById('med-view-list').style.display  = view === 'list'  ? 'block' : 'none';
  document.getElementById('med-view-log').style.display   = view === 'log'   ? 'block' : 'none';
  document.getElementById('med-tab-today').className = view === 'today' ? 'btn btn-primary' : 'btn btn-ghost';
  document.getElementById('med-tab-list').className  = view === 'list'  ? 'btn btn-primary' : 'btn btn-ghost';
  document.getElementById('med-tab-log').className   = view === 'log'   ? 'btn btn-primary' : 'btn btn-ghost';
}

function renderTodayView() {
  const meds = Storage.getArray('ng_medications');
  const today = new Date().toISOString().slice(0,10);
  const log = Storage.getArray('ng_med_log').filter(l => l.date === today);
  const container = document.getElementById('med-view-today');

  if (meds.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align:center;padding:32px 24px">
        <div style="font-size:56px;margin-bottom:16px">💊</div>
        <p style="font-size:22px;color:var(--text-muted);margin-bottom:20px">No medications added yet.</p>
        <button class="btn btn-primary" onclick="document.getElementById('med-tab-list').click()">+ Add a Medication</button>
      </div>`;
    return;
  }

  const now = new Date();
  const totalDue = meds.reduce((n, m) => n + (m.schedule||[]).filter(s => {
    const [h] = (s.time || '00:00').split(':').map(Number);
    return h <= now.getHours();
  }).length, 0);
  const takenCount = log.filter(l => l.taken).length;
  const allDone = totalDue > 0 && takenCount >= totalDue;

  let html = '';

  // All-done celebration banner
  if (allDone) {
    html += `<div style="background:#e8f5e9;border:2px solid #a5d6a7;border-radius:16px;padding:20px 24px;margin:12px 20px;display:flex;align-items:center;gap:16px">
      <span style="font-size:40px">🎉</span>
      <div>
        <div style="font-size:22px;font-weight:700;color:#1a5c38">All done for now!</div>
        <div style="font-size:18px;color:#2e6b3e;margin-top:4px">All medicines taken today. Great job, Richard!</div>
      </div>
    </div>`;
  }

  // Group doses by slot
  SLOTS.forEach(slot => {
    const slotMeds = meds.filter(m => (m.schedule||[]).some(s => s.slot === slot.id));
    if (slotMeds.length === 0) return;

    html += `<div class="card" style="margin:12px 20px">
      <div class="med-slot-header">${slot.emoji} ${slot.label}</div>`;

    slotMeds.forEach(m => {
      const schedEntry = m.schedule.find(s => s.slot === slot.id);
      const logEntry = log.find(l => l.medicationId === m.id && l.slot === slot.id);
      const taken = logEntry?.taken || false;

      let missed = false;
      if (!taken && schedEntry?.time) {
        const [sh, sm] = schedEntry.time.split(':').map(Number);
        const scheduled = new Date(); scheduled.setHours(sh, sm, 0, 0);
        missed = (now - scheduled) > 60 * 60 * 1000;
      }

      const cardClass = taken ? 'med-card taken' : missed ? 'med-card missed' : 'med-card';
      const btnClass  = taken ? 'dose-btn taken' : 'dose-btn';
      const statusHtml = taken
        ? '<div class="med-status taken">✓ Taken</div>'
        : missed
        ? '<div class="med-status missed">⚠ Missed — please take now</div>'
        : '';

      html += `
        <div class="${cardClass}">
          <div class="med-info">
            <div class="med-name">${m.brandName}</div>
            ${m.genericName ? `<div class="med-generic">${m.genericName}</div>` : ''}
            ${m.dosage ? `<div class="med-dosage">${m.dosage}${m.form ? ' · ' + m.form : ''}</div>` : ''}
            ${schedEntry?.time ? `<div class="med-time">⏰ ${formatTime12Med(schedEntry.time)}</div>` : ''}
            ${statusHtml}
          </div>
          <button class="${btnClass}"
            onclick="checkDose('${m.id}','${slot.id}','${today}',${taken})"
            aria-label="${taken ? 'Mark as not taken' : 'Mark as taken'}: ${m.brandName}">
            ${taken ? '✓' : '○'}
          </button>
        </div>`;
    });
    html += `</div>`;
  });

  if (!html) {
    html = `<div class="card" style="margin:12px 20px"><p style="color:var(--text-muted)">No doses scheduled yet.</p></div>`;
  }
  container.innerHTML = html;

  detectMissedDoses();
}

function checkDose(medId, slot, date, currentlyTaken) {
  const newTaken = !currentlyTaken;
  const log = Storage.getArray('ng_med_log');
  const idx = log.findIndex(l => l.medicationId === medId && l.slot === slot && l.date === date);
  const entry = { id: Storage.uid(), date, medicationId: medId, slot, taken: newTaken, timestamp: Date.now() };
  if (idx >= 0) log[idx] = { ...log[idx], ...entry };
  else log.push(entry);
  Storage.set('ng_med_log', log);

  if (newTaken) {
    // Check if this was the last remaining dose
    const meds = Storage.getArray('ng_medications');
    const now = new Date();
    const totalDue = meds.reduce((n, m) => n + (m.schedule||[]).filter(s => {
      const [h] = (s.time || '00:00').split(':').map(Number);
      return h <= now.getHours();
    }).length, 0);
    const takenCount = log.filter(l => l.date === date && l.taken).length;
    if (takenCount >= totalDue) {
      showToast('🎉 All medicines taken today!');
    } else {
      showToast('✓ Marked as taken!');
    }
  }

  renderTodayView();
}

function detectMissedDoses() {
  const meds = Storage.getArray('ng_medications');
  const today = new Date().toISOString().slice(0,10);
  const log = Storage.getArray('ng_med_log').filter(l => l.date === today && l.taken);
  const now = new Date();
  const missed = [];

  meds.forEach(m => {
    (m.schedule||[]).forEach(s => {
      if (!s.time) return;
      const [sh, sm] = s.time.split(':').map(Number);
      const scheduled = new Date(); scheduled.setHours(sh, sm, 0, 0);
      const alreadyTaken = log.some(l => l.medicationId === m.id && l.slot === s.slot);
      if (!alreadyTaken && (now - scheduled) > 60 * 60 * 1000) {
        missed.push({ med: m, slot: s.slot });
      }
    });
  });

  if (missed.length > 0) {
    const monitors = Storage.getArray('ng_contacts').filter(c => c.isMedMonitor && c.email);
    const profile = Storage.get('ng_profile');
    monitors.forEach(caregiver => {
      missed.forEach(({ med, slot }) => sendMissedDoseAlert(med, slot, caregiver, profile));
    });
  }
}

// INTEGRATION POINT: Missed dose caregiver notification
function sendMissedDoseAlert(med, slot, caregiver, profile) {
  console.log('[INTEGRATION POINT] Missed dose:', med.brandName, slot, '->', caregiver.email);
}

function formatTime12Med(time24) {
  const [h, m] = time24.split(':').map(Number);
  const ampm = h < 12 ? 'am' : 'pm';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function renderPrescriptionList() {
  const meds = Storage.getArray('ng_medications');
  const container = document.getElementById('med-prescription-list');
  if (meds.length === 0) {
    container.innerHTML = `<p style="padding:20px;color:var(--text-muted);font-size:22px">No medications added yet.</p>`;
    return;
  }
  container.innerHTML = meds.map(m => `
    <div class="card" style="margin:8px 20px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
        <div style="flex:1">
          <div style="font-size:22px;font-weight:700">${m.brandName}</div>
          ${m.genericName ? `<div style="color:var(--text-muted);font-size:18px">${m.genericName}</div>` : ''}
          <div style="margin-top:6px;font-size:18px">${m.dosage || ''}${m.form ? ' · ' + m.form : ''}</div>
          ${m.instructions ? `<div style="color:var(--text-muted);font-size:16px;margin-top:4px">${m.instructions}</div>` : ''}
          ${m.pillDescription ? `<div style="color:var(--text-muted);font-size:15px;margin-top:4px">💊 ${m.pillDescription}</div>` : ''}
          <div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:6px">
            ${(m.schedule||[]).map(s => {
              const sl = SLOTS.find(x => x.id === s.slot);
              return `<span style="display:inline-block;background:#f0f7f0;border:1px solid var(--border);border-radius:20px;padding:4px 14px;font-size:15px;font-weight:600">${sl?.emoji||''} ${sl?.label||s.slot}${s.time ? ' · ' + formatTime12Med(s.time) : ''}</span>`;
            }).join('')}
          </div>
        </div>
        <button class="btn btn-ghost" onclick="openMedModal('${m.id}')" aria-label="Edit ${m.brandName}">Edit</button>
      </div>
    </div>
  `).join('');
}

function renderLogView() {
  const meds = Storage.getArray('ng_medications');
  const log = Storage.getArray('ng_med_log');
  const container = document.getElementById('med-log-view');
  const days = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0,10));
  }
  container.innerHTML = days.map(date => {
    const dayLog = log.filter(l => l.date === date);
    const d = new Date(date + 'T00:00:00');
    const label = d.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });
    const entries = meds.flatMap(m => (m.schedule||[]).map(s => {
      const sl = SLOTS.find(x => x.id === s.slot);
      const entry = dayLog.find(l => l.medicationId === m.id && l.slot === s.slot);
      return `<div style="font-size:18px;padding:8px 0;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px">
        <span style="font-size:22px">${entry?.taken ? '✅' : '❌'}</span>
        <span>${m.brandName}</span>
        <span style="color:var(--text-muted);font-size:15px">${sl?.emoji||''} ${sl?.label||s.slot}</span>
      </div>`;
    }));
    if (entries.length === 0) return '';
    return `<div class="card" style="margin:8px 20px">
      <div style="font-size:18px;font-weight:700;color:var(--primary);margin-bottom:10px">${label}</div>
      ${entries.join('')}
    </div>`;
  }).join('');
}

let scheduleSlots = [];

function openMedModal(id) {
  const modal = document.getElementById('med-modal');
  const m = id ? Storage.getArray('ng_medications').find(x => x.id === id) : null;
  document.getElementById('med-modal-title').textContent = m ? 'Edit Medication' : 'Add Medication';
  document.getElementById('med-id').value = id || '';
  document.getElementById('med-brand').value = m?.brandName || '';
  document.getElementById('med-generic').value = m?.genericName || '';
  document.getElementById('med-dosage').value = m?.dosage || '';
  document.getElementById('med-form').value = m?.form || 'Tablet';
  document.getElementById('med-instructions').value = m?.instructions || '';
  document.getElementById('med-desc').value = m?.pillDescription || '';
  scheduleSlots = m?.schedule ? JSON.parse(JSON.stringify(m.schedule)) : [];
  renderScheduleSlots();
  document.getElementById('med-delete-btn').style.display = m ? 'inline-flex' : 'none';
  modal.showModal();
  document.getElementById('med-brand').focus();
}

function renderScheduleSlots() {
  const container = document.getElementById('med-schedule-fields');
  container.innerHTML = scheduleSlots.map((s, i) => `
    <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
      <select onchange="scheduleSlots[${i}].slot=this.value" style="flex:1;margin-bottom:0">
        ${SLOTS.map(sl => `<option value="${sl.id}" ${s.slot===sl.id?'selected':''}>${sl.emoji} ${sl.label}</option>`).join('')}
      </select>
      <input type="time" value="${s.time||''}" onchange="scheduleSlots[${i}].time=this.value" style="width:120px;margin-bottom:0">
      <button type="button" onclick="removeSlot(${i})" style="background:#c0392b;color:white;border:none;border-radius:8px;padding:8px 12px;cursor:pointer;font-size:18px;min-height:48px" aria-label="Remove slot">✕</button>
    </div>
  `).join('');
}

function addScheduleSlot() {
  scheduleSlots.push({ slot:'morning', time:'08:00' });
  renderScheduleSlots();
}

function removeSlot(i) {
  scheduleSlots.splice(i, 1);
  renderScheduleSlots();
}

function closeMedModal() { document.getElementById('med-modal').close(); }

function saveMedication() {
  const brandName = document.getElementById('med-brand').value.trim();
  if (!brandName) { alert('Medication name is required.'); return; }
  const id = document.getElementById('med-id').value;
  const med = {
    id: id || Storage.uid(),
    brandName,
    genericName: document.getElementById('med-generic').value.trim(),
    dosage: document.getElementById('med-dosage').value.trim(),
    form: document.getElementById('med-form').value,
    instructions: document.getElementById('med-instructions').value.trim(),
    pillDescription: document.getElementById('med-desc').value.trim(),
    schedule: scheduleSlots,
    pillPhoto: null,
    labelText: ''
  };
  if (id) Storage.update('ng_medications', id, med);
  else Storage.push('ng_medications', med);
  closeMedModal();
  renderTodayView();
}

function deleteMedication() {
  const id = document.getElementById('med-id').value;
  if (!id || !confirm('Remove this medication?')) return;
  Storage.remove('ng_medications', id);
  const log = Storage.getArray('ng_med_log').filter(l => l.medicationId !== id);
  Storage.set('ng_med_log', log);
  closeMedModal();
  renderPrescriptionList();
  showMedView('list');
}

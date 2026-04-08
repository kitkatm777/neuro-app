const SLOTS = [
  { id:'morning',   label:'Morning',   emoji:'🌅' },
  { id:'afternoon', label:'Afternoon', emoji:'☀️' },
  { id:'evening',   label:'Evening',   emoji:'🌆' },
  { id:'bedtime',   label:'Bedtime',   emoji:'🌙' },
];

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
      <div class="card">
        <p style="font-size:20px;color:var(--text-muted);text-align:center;padding:20px 0">
          No medications added yet.<br><br>
          <button class="btn btn-primary" onclick="document.getElementById('med-tab-list').click()">+ Add a Medication</button>
        </p>
      </div>`;
    return;
  }

  // Group doses by slot
  const now = new Date();
  let html = '';
  SLOTS.forEach(slot => {
    const slotMeds = meds.filter(m => (m.schedule||[]).some(s => s.slot === slot.id));
    if (slotMeds.length === 0) return;

    html += `<div class="card" style="margin:12px 20px">
      <div style="font-size:20px;font-weight:700;color:var(--primary);margin-bottom:16px">${slot.emoji} ${slot.label}</div>`;

    slotMeds.forEach(m => {
      const schedEntry = m.schedule.find(s => s.slot === slot.id);
      const logEntry = log.find(l => l.medicationId === m.id && l.slot === slot.id);
      const taken = logEntry?.taken || false;

      // Missed check: scheduled time > 60 min ago and not taken
      let missed = false;
      if (!taken && schedEntry?.time) {
        const [sh, sm] = schedEntry.time.split(':').map(Number);
        const scheduled = new Date(); scheduled.setHours(sh, sm, 0, 0);
        missed = (now - scheduled) > 60 * 60 * 1000;
      }

      const bg = taken ? '#e8f5e9' : missed ? '#fff3e0' : 'var(--surface)';
      const border = taken ? '#a5d6a7' : missed ? '#ffcc80' : 'var(--border)';
      const statusText = taken ? '✓ Taken' : missed ? '⚠ Missed' : '';
      const statusColor = taken ? '#2e6b3e' : '#b45309';

      html += `
        <div style="display:flex;align-items:center;gap:16px;padding:16px;background:${bg};border:2px solid ${border};border-radius:12px;margin-bottom:10px">
          <div style="flex:1">
            <div style="font-size:20px;font-weight:700">${m.brandName}</div>
            ${m.genericName ? `<div style="font-size:15px;color:var(--text-muted)">${m.genericName}</div>` : ''}
            <div style="font-size:16px;color:var(--text-muted)">${m.dosage || ''} ${m.form || ''}</div>
            ${m.instructions ? `<div style="font-size:15px;color:var(--text-muted);font-style:italic">${m.instructions}</div>` : ''}
            ${schedEntry?.time ? `<div style="font-size:15px;color:var(--text-muted)">⏰ ${schedEntry.time}</div>` : ''}
            ${statusText ? `<div style="font-size:15px;font-weight:700;color:${statusColor};margin-top:4px">${statusText}</div>` : ''}
          </div>
          <button onclick="checkDose('${m.id}','${slot.id}','${today}',${taken})"
            style="min-width:80px;min-height:80px;border-radius:12px;border:3px solid ${taken ? '#4a7c59' : 'var(--border)'};background:${taken ? '#4a7c59' : 'white'};color:${taken ? 'white' : 'var(--text)'};font-size:28px;cursor:pointer;display:flex;align-items:center;justify-content:center"
            aria-label="${taken ? 'Mark as not taken' : 'Mark as taken'}: ${m.brandName}">
            ${taken ? '✓' : '○'}
          </button>
        </div>`;
    });
    html += `</div>`;
  });

  if (!html) {
    html = `<div class="card"><p style="color:var(--text-muted);padding:12px">No doses scheduled. Add a medication with a schedule.</p></div>`;
  }
  container.innerHTML = html;

  // Check for missed doses and alert caregiver
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
// Uses EmailJS (client-side, no backend). Configure in Settings: EmailJS public key + template ID.
// emailjs.send(serviceId, templateId, { to_email, med_name, slot, patient_name })
function sendMissedDoseAlert(med, slot, caregiver, profile) {
  console.log('[INTEGRATION POINT] Missed dose:', med.brandName, slot, '->', caregiver.email);
  // if (window.emailjs) emailjs.send('YOUR_SERVICE','YOUR_TEMPLATE',{ to_email: caregiver.email, med_name: med.brandName, slot, patient_name: profile?.name });
}

function renderPrescriptionList() {
  const meds = Storage.getArray('ng_medications');
  const container = document.getElementById('med-prescription-list');
  if (meds.length === 0) {
    container.innerHTML = `<p style="padding:20px;color:var(--text-muted)">No medications added yet.</p>`;
    return;
  }
  container.innerHTML = meds.map(m => `
    <div class="card" style="margin:8px 20px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-size:20px;font-weight:700">${m.brandName}</div>
          ${m.genericName ? `<div style="color:var(--text-muted)">${m.genericName}</div>` : ''}
          <div style="margin-top:6px;font-size:16px">${m.dosage || ''} ${m.form || ''}</div>
          ${m.instructions ? `<div style="color:var(--text-muted);font-style:italic">${m.instructions}</div>` : ''}
          ${m.pillDescription ? `<div style="color:var(--text-muted);font-size:14px">💊 ${m.pillDescription}</div>` : ''}
          <div style="margin-top:8px">
            ${(m.schedule||[]).map(s => `<span style="display:inline-block;background:var(--bg);border-radius:6px;padding:3px 10px;margin:2px;font-size:14px">${SLOTS.find(sl=>sl.id===s.slot)?.emoji||''} ${s.slot} ${s.time||''}</span>`).join('')}
          </div>
        </div>
        <button class="btn btn-ghost" style="padding:8px 12px;flex-shrink:0" onclick="openMedModal('${m.id}')" aria-label="Edit ${m.brandName}">Edit</button>
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
    if (dayLog.length === 0 && meds.length === 0) return '';
    const d = new Date(date + 'T00:00:00');
    const label = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()] + ' ' + (d.getMonth()+1) + '/' + d.getDate();
    const entries = meds.flatMap(m => (m.schedule||[]).map(s => {
      const entry = dayLog.find(l => l.medicationId === m.id && l.slot === s.slot);
      return `<div style="font-size:15px;padding:4px 0;border-bottom:1px solid var(--border)">
        ${entry?.taken ? '✅' : '❌'} ${m.brandName} — ${s.slot}
      </div>`;
    }));
    if (entries.length === 0) return '';
    return `<div class="card" style="margin:8px 20px">
      <div style="font-weight:700;margin-bottom:8px">${label}</div>
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
  // Remove log entries for this med
  const log = Storage.getArray('ng_med_log').filter(l => l.medicationId !== id);
  Storage.set('ng_med_log', log);
  closeMedModal();
  renderPrescriptionList();
  showMedView('list');
}

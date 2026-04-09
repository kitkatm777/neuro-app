// Task 16: Birthdays
function render_birthdays() {
  renderBirthdayList();
  const addBtn = document.getElementById('bday-add-btn');
  if (addBtn && !addBtn._bound) {
    addBtn._bound = true;
    addBtn.addEventListener('click', () => openBdayModal());
    document.getElementById('bday-save-btn').addEventListener('click', saveBirthday);
    document.getElementById('bday-cancel-btn').addEventListener('click', closeBdayModal);
    document.getElementById('bday-delete-btn').addEventListener('click', deleteBirthday);
  }
}

function renderBirthdayList() {
  const list = document.getElementById('bday-list');
  if (!list) return;
  const birthdays = Storage.getArray('ng_birthdays');
  if (!birthdays.length) {
    list.innerHTML = `
      <div style="padding:32px 20px;text-align:center;color:var(--text-muted)">
        <div style="font-size:48px;margin-bottom:12px">🎂</div>
        <p style="font-size:20px;margin-bottom:8px">No birthdays saved yet</p>
        <p style="font-size:16px">Tap <strong>+ Add Birthday</strong> to remember someone special.</p>
      </div>`;
    return;
  }

  const today = new Date();
  const todayM = today.getMonth();
  const todayD = today.getDate();

  const withDays = birthdays.map(b => {
    let daysUntil = null;
    let turnsAge = null;
    if (b.date) {
      const bd = new Date(b.date + 'T12:00:00');
      const thisYear = new Date(today.getFullYear(), bd.getMonth(), bd.getDate());
      if (thisYear < today) thisYear.setFullYear(today.getFullYear() + 1);
      daysUntil = Math.round((thisYear - today) / 86400000);
      turnsAge = thisYear.getFullYear() - bd.getFullYear();
    }
    return { ...b, daysUntil, turnsAge };
  }).sort((a, b) => (a.daysUntil ?? 999) - (b.daysUntil ?? 999));

  list.innerHTML = withDays.map(b => {
    let badge = '';
    if (b.daysUntil === 0) badge = `<span class="status-pill pill-alert">🎉 TODAY!</span>`;
    else if (b.daysUntil === 1) badge = `<span class="status-pill pill-warn">Tomorrow</span>`;
    else if (b.daysUntil <= 7) badge = `<span class="status-pill pill-info">In ${b.daysUntil} days</span>`;
    const ageStr = b.turnsAge ? ` · Turns ${b.turnsAge}` : '';
    const dateStr = b.date ? new Date(b.date + 'T12:00:00').toLocaleDateString('en-US', { month:'long', day:'numeric' }) + ageStr : '';
    return `
      <div class="card" style="margin:0 20px 12px;cursor:pointer;display:flex;align-items:center;gap:14px"
        onclick="openBdayModal('${b.id}')" role="button" tabindex="0" aria-label="Edit birthday: ${b.name}">
        <div style="font-size:36px">🎂</div>
        <div style="flex:1">
          <div style="font-size:19px;font-weight:700;color:var(--primary)">${b.name}</div>
          ${b.relation ? `<div style="font-size:14px;color:var(--text-muted)">${b.relation}</div>` : ''}
          ${dateStr ? `<div style="font-size:15px;color:var(--text-muted)">${dateStr}</div>` : ''}
        </div>
        ${badge}
      </div>`;
  }).join('');
}

function openBdayModal(id) {
  const modal = document.getElementById('bday-modal');
  const titleEl = document.getElementById('bday-modal-title');
  const del = document.getElementById('bday-delete-btn');
  ['bday-id','bday-name','bday-date','bday-relation','bday-notes'].forEach(i => {
    const el = document.getElementById(i);
    if (el) el.value = '';
  });
  del.style.display = 'none';
  if (id) {
    const b = Storage.getArray('ng_birthdays').find(x => x.id === id);
    if (b) {
      document.getElementById('bday-id').value = b.id;
      document.getElementById('bday-name').value = b.name || '';
      document.getElementById('bday-date').value = b.date || '';
      document.getElementById('bday-relation').value = b.relation || '';
      document.getElementById('bday-notes').value = b.notes || '';
      del.style.display = '';
    }
    titleEl.textContent = 'Edit Birthday';
  } else {
    titleEl.textContent = 'Add Birthday';
  }
  modal.showModal();
}

function closeBdayModal() {
  document.getElementById('bday-modal').close();
}

function saveBirthday() {
  const name = document.getElementById('bday-name').value.trim();
  if (!name) { alert('Please enter a name.'); return; }
  const date = document.getElementById('bday-date').value;
  if (!date) { alert('Please choose a birthday date.'); return; }
  const id = document.getElementById('bday-id').value;
  const item = {
    id: id || Storage.uid(),
    name,
    date,
    relation: document.getElementById('bday-relation').value.trim(),
    notes: document.getElementById('bday-notes').value.trim()
  };
  if (id) Storage.update('ng_birthdays', id, item);
  else Storage.push('ng_birthdays', item);
  closeBdayModal();
  renderBirthdayList();
}

function deleteBirthday() {
  const id = document.getElementById('bday-id').value;
  if (!id || !confirm('Delete this birthday?')) return;
  Storage.remove('ng_birthdays', id);
  closeBdayModal();
  renderBirthdayList();
}

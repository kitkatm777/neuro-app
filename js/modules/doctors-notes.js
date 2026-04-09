// Task 13: Doctor's Notes
function render_doctors_notes() {
  renderNotesList();
  const addBtn = document.getElementById('notes-add-btn');
  if (addBtn && !addBtn._bound) {
    addBtn._bound = true;
    addBtn.addEventListener('click', () => openNoteModal());
    document.getElementById('notes-save-btn').addEventListener('click', saveNote);
    document.getElementById('notes-cancel-btn').addEventListener('click', closeNoteModal);
    document.getElementById('notes-delete-btn').addEventListener('click', deleteNote);
  }
  // set default date to today for new notes
  const today = new Date().toISOString().split('T')[0];
  const dateEl = document.getElementById('notes-date');
  if (dateEl && !dateEl.value) dateEl.value = today;
}

function renderNotesList() {
  const list = document.getElementById('notes-list');
  if (!list) return;
  const notes = Storage.getArray('ng_notes').sort((a,b) => (b.date||'').localeCompare(a.date||''));
  if (!notes.length) {
    list.innerHTML = `
      <div style="padding:32px 20px;text-align:center;color:var(--text-muted)">
        <div style="font-size:48px;margin-bottom:12px">📋</div>
        <p style="font-size:20px;margin-bottom:8px">No notes yet</p>
        <p style="font-size:16px">Tap <strong>+ Add Note</strong> to record what your doctor said.</p>
      </div>`;
    return;
  }
  list.innerHTML = notes.map(n => {
    const followup = n.followup
      ? `<div style="margin-top:8px;font-size:15px;color:var(--accent);font-weight:600">📅 Follow-up: ${formatNoteDate(n.followup)}</div>`
      : '';
    return `
      <div class="card" style="margin:0 20px 14px;cursor:pointer" onclick="openNoteModal('${n.id}')" role="button" tabindex="0" aria-label="Edit note: ${n.title}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
          <div style="flex:1">
            <div style="font-size:20px;font-weight:700;color:var(--primary);margin-bottom:4px">${n.title}</div>
            ${n.doctor ? `<div style="font-size:15px;color:var(--text-muted);margin-bottom:4px">👨‍⚕️ ${n.doctor}</div>` : ''}
            ${n.date ? `<div style="font-size:15px;color:var(--text-muted)">${formatNoteDate(n.date)}</div>` : ''}
          </div>
        </div>
        ${n.body ? `<div style="margin-top:10px;font-size:16px;color:var(--text);white-space:pre-wrap;line-height:1.5;border-top:1px solid var(--border);padding-top:10px">${truncate(n.body,200)}</div>` : ''}
        ${followup}
      </div>`;
  }).join('');
}

function formatNoteDate(d) {
  if (!d) return '';
  const dt = new Date(d + 'T12:00:00');
  return dt.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
}

function truncate(str, max) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
}

function openNoteModal(id) {
  const modal = document.getElementById('notes-modal');
  const title = document.getElementById('notes-modal-title');
  const del = document.getElementById('notes-delete-btn');
  document.getElementById('notes-id').value = '';
  document.getElementById('notes-title').value = '';
  document.getElementById('notes-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('notes-doctor').value = '';
  document.getElementById('notes-body').value = '';
  document.getElementById('notes-followup').value = '';
  del.style.display = 'none';
  if (id) {
    const n = Storage.getArray('ng_notes').find(x => x.id === id);
    if (n) {
      document.getElementById('notes-id').value = n.id;
      document.getElementById('notes-title').value = n.title || '';
      document.getElementById('notes-date').value = n.date || '';
      document.getElementById('notes-doctor').value = n.doctor || '';
      document.getElementById('notes-body').value = n.body || '';
      document.getElementById('notes-followup').value = n.followup || '';
      del.style.display = '';
    }
    title.textContent = 'Edit Note';
  } else {
    title.textContent = 'Add Note';
  }
  modal.showModal();
}

function closeNoteModal() {
  document.getElementById('notes-modal').close();
}

function saveNote() {
  const title = document.getElementById('notes-title').value.trim();
  if (!title) { alert('Please enter a title for this note.'); return; }
  const id = document.getElementById('notes-id').value;
  const note = {
    id: id || Storage.uid(),
    title,
    date: document.getElementById('notes-date').value,
    doctor: document.getElementById('notes-doctor').value.trim(),
    body: document.getElementById('notes-body').value.trim(),
    followup: document.getElementById('notes-followup').value,
    createdAt: id ? undefined : new Date().toISOString()
  };
  if (id) {
    Storage.update('ng_notes', id, note);
  } else {
    Storage.push('ng_notes', note);
  }
  closeNoteModal();
  renderNotesList();
}

function deleteNote() {
  const id = document.getElementById('notes-id').value;
  if (!id) return;
  if (!confirm('Delete this note?')) return;
  Storage.remove('ng_notes', id);
  closeNoteModal();
  renderNotesList();
}

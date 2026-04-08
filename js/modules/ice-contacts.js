function render_ice_contacts() {
  renderIceList();
  document.getElementById('ice-add-btn').onclick = () => openIceModal(null);
  document.getElementById('ice-save-btn').onclick = saveIceContact;
  document.getElementById('ice-cancel-btn').onclick = closeIceModal;
  document.getElementById('ice-delete-btn').onclick = deleteIceContact;
}

function renderIceList() {
  const contacts = Storage.getArray('ng_contacts');
  const list = document.getElementById('ice-list');
  if (contacts.length === 0) {
    list.innerHTML = `<p style="padding:20px;color:var(--text-muted)">No contacts yet. Add your first contact above.</p>`;
    return;
  }
  const sorted = [...contacts].sort((a,b) => (b.isICE?1:0) - (a.isICE?1:0));
  list.innerHTML = sorted.map(c => `
    <div class="card" style="margin:8px 20px;display:flex;align-items:center;gap:16px">
      <div style="width:56px;height:56px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;color:white;font-size:22px;font-weight:700;flex-shrink:0">
        ${c.name.charAt(0).toUpperCase()}
      </div>
      <div style="flex:1;min-width:0">
        <div style="font-size:18px;font-weight:700">${c.name}${c.isICE?' <span style="background:#e05c1a;color:white;border-radius:6px;padding:2px 8px;font-size:12px;margin-left:6px">ICE</span>':''}</div>
        <div style="color:var(--text-muted);font-size:15px">${c.role}</div>
        ${c.notes ? `<div style="color:var(--text-muted);font-size:14px;margin-top:4px;font-style:italic">${c.notes}</div>` : ''}
        <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
          ${c.phone ? `<a href="tel:${c.phone}" class="btn btn-primary" style="padding:8px 14px;font-size:14px" aria-label="Call ${c.name}">📞 Call</a>` : ''}
          ${c.email ? `<a href="mailto:${c.email}" class="btn btn-ghost" style="padding:8px 14px;font-size:14px" aria-label="Email ${c.name}">✉ Email</a>` : ''}
        </div>
      </div>
      <button class="btn btn-ghost" style="padding:8px 12px;flex-shrink:0" onclick="openIceModal('${c.id}')" aria-label="Edit ${c.name}">Edit</button>
    </div>
  `).join('');
}

function openIceModal(id) {
  const modal = document.getElementById('ice-modal');
  const c = id ? Storage.getArray('ng_contacts').find(x => x.id === id) : null;
  document.getElementById('ice-modal-title').textContent = c ? 'Edit Contact' : 'Add Contact';
  document.getElementById('ice-id').value = id || '';
  document.getElementById('ice-name').value = c?.name || '';
  document.getElementById('ice-role').value = c?.role || '';
  document.getElementById('ice-phone').value = c?.phone || '';
  document.getElementById('ice-email').value = c?.email || '';
  document.getElementById('ice-notes').value = c?.notes || '';
  document.getElementById('ice-is-ice').checked = c?.isICE || false;
  document.getElementById('ice-is-monitor').checked = c?.isMedMonitor || false;
  document.getElementById('ice-delete-btn').style.display = c ? 'inline-flex' : 'none';
  modal.showModal();
  document.getElementById('ice-name').focus();
}

function closeIceModal() { document.getElementById('ice-modal').close(); }

function saveIceContact() {
  const name = document.getElementById('ice-name').value.trim();
  if (!name) { alert('Name is required.'); return; }
  const id = document.getElementById('ice-id').value;
  const contact = {
    id: id || Storage.uid(),
    name,
    role: document.getElementById('ice-role').value.trim(),
    phone: document.getElementById('ice-phone').value.trim(),
    email: document.getElementById('ice-email').value.trim(),
    notes: document.getElementById('ice-notes').value.trim(),
    isICE: document.getElementById('ice-is-ice').checked,
    isMedMonitor: document.getElementById('ice-is-monitor').checked,
    photo: null
  };
  if (id) Storage.update('ng_contacts', id, contact);
  else Storage.push('ng_contacts', contact);
  closeIceModal();
  renderIceList();
}

function deleteIceContact() {
  const id = document.getElementById('ice-id').value;
  if (!id || !confirm('Delete this contact?')) return;
  Storage.remove('ng_contacts', id);
  closeIceModal();
  renderIceList();
}

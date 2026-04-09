// Task 16b: Pet Care
function render_pets() {
  renderPetList();
  const addBtn = document.getElementById('pet-add-btn');
  if (addBtn && !addBtn._bound) {
    addBtn._bound = true;
    addBtn.addEventListener('click', () => openPetModal());
    document.getElementById('pet-save-btn').addEventListener('click', savePet);
    document.getElementById('pet-cancel-btn').addEventListener('click', closePetModal);
    document.getElementById('pet-delete-btn').addEventListener('click', deletePet);
  }
}

function renderPetList() {
  const list = document.getElementById('pet-list');
  if (!list) return;
  const pets = Storage.getArray('ng_pets');
  if (!pets.length) {
    list.innerHTML = `
      <div style="padding:32px 20px;text-align:center;color:var(--text-muted)">
        <div style="font-size:48px;margin-bottom:12px">🐾</div>
        <p style="font-size:20px;margin-bottom:8px">No pets added yet</p>
        <p style="font-size:16px">Tap <strong>+ Add Pet</strong> to save your pet's details.</p>
      </div>`;
    return;
  }
  list.innerHTML = pets.map(p => {
    const emoji = petEmoji(p.species);
    return `
      <div class="card" style="margin:0 20px 14px;cursor:pointer"
        onclick="openPetModal('${p.id}')" role="button" tabindex="0" aria-label="Edit pet: ${p.name}">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:${p.notes ? '12px' : '0'}">
          <div style="font-size:40px">${emoji}</div>
          <div style="flex:1">
            <div style="font-size:21px;font-weight:700;color:var(--primary)">${p.name}</div>
            <div style="font-size:15px;color:var(--text-muted)">${[p.species, p.breed].filter(Boolean).join(' · ')}</div>
          </div>
        </div>
        ${(p.vet || p.vetPhone) ? `
          <div style="border-top:1px solid var(--border);padding-top:10px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            ${p.vet ? `<span style="font-size:15px;color:var(--text-muted)">🏥 ${p.vet}</span>` : ''}
            ${p.vetPhone ? `<a href="tel:${p.vetPhone.replace(/\D/g,'')}" class="btn btn-ghost" style="text-decoration:none;font-size:15px;padding:8px 14px" onclick="event.stopPropagation()">📞 ${p.vetPhone}</a>` : ''}
          </div>` : ''}
        ${p.notes ? `<div style="border-top:1px solid var(--border);padding-top:10px;font-size:15px;color:var(--text);white-space:pre-wrap">${p.notes}</div>` : ''}
      </div>`;
  }).join('');
}

function petEmoji(species) {
  if (!species) return '🐾';
  const s = species.toLowerCase();
  if (s.includes('dog')) return '🐕';
  if (s.includes('cat')) return '🐈';
  if (s.includes('bird')) return '🐦';
  if (s.includes('fish')) return '🐠';
  if (s.includes('rabbit')) return '🐇';
  return '🐾';
}

function openPetModal(id) {
  const modal = document.getElementById('pet-modal');
  const titleEl = document.getElementById('pet-modal-title');
  const del = document.getElementById('pet-delete-btn');
  ['pet-id','pet-name','pet-species','pet-breed','pet-vet','pet-vet-phone','pet-notes'].forEach(i => {
    const el = document.getElementById(i);
    if (el) el.value = '';
  });
  del.style.display = 'none';
  if (id) {
    const p = Storage.getArray('ng_pets').find(x => x.id === id);
    if (p) {
      document.getElementById('pet-id').value = p.id;
      document.getElementById('pet-name').value = p.name || '';
      document.getElementById('pet-species').value = p.species || '';
      document.getElementById('pet-breed').value = p.breed || '';
      document.getElementById('pet-vet').value = p.vet || '';
      document.getElementById('pet-vet-phone').value = p.vetPhone || '';
      document.getElementById('pet-notes').value = p.notes || '';
      del.style.display = '';
    }
    titleEl.textContent = 'Edit Pet';
  } else {
    titleEl.textContent = 'Add Pet';
  }
  modal.showModal();
}

function closePetModal() {
  document.getElementById('pet-modal').close();
}

function savePet() {
  const name = document.getElementById('pet-name').value.trim();
  if (!name) { alert('Please enter a pet name.'); return; }
  const id = document.getElementById('pet-id').value;
  const item = {
    id: id || Storage.uid(),
    name,
    species: document.getElementById('pet-species').value.trim(),
    breed: document.getElementById('pet-breed').value.trim(),
    vet: document.getElementById('pet-vet').value.trim(),
    vetPhone: document.getElementById('pet-vet-phone').value.trim(),
    notes: document.getElementById('pet-notes').value.trim()
  };
  if (id) Storage.update('ng_pets', id, item);
  else Storage.push('ng_pets', item);
  closePetModal();
  renderPetList();
}

function deletePet() {
  const id = document.getElementById('pet-id').value;
  if (!id || !confirm('Remove this pet?')) return;
  Storage.remove('ng_pets', id);
  closePetModal();
  renderPetList();
}

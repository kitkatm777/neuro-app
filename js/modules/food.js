const FOOD_CATEGORIES = ['Fruits & Vegetables','Proteins','Grains & Bread','Dairy','Beverages','Household','Other'];

function render_food() {
  setupFoodTabs();
  showFoodView('pantry');
}

function setupFoodTabs() {
  document.getElementById('food-tab-pantry').onclick  = () => { showFoodView('pantry'); renderPantry(); };
  document.getElementById('food-tab-list').onclick    = () => { showFoodView('list'); renderShoppingList(); };
  document.getElementById('food-tab-links').onclick   = () => { showFoodView('links'); renderFoodLinks(); };
  document.getElementById('food-add-item-btn').onclick = () => openFoodModal(null);
  document.getElementById('food-save-btn').onclick    = saveFoodItem;
  document.getElementById('food-cancel-btn').onclick  = closeFoodModal;
  document.getElementById('food-delete-btn').onclick  = deleteFoodItem;
  document.getElementById('food-add-shop-btn').onclick = () => openShopModal(null);
  document.getElementById('food-shop-save-btn').onclick   = saveShopItem;
  document.getElementById('food-shop-cancel-btn').onclick = closeShopModal;
  document.getElementById('food-shop-delete-btn').onclick = deleteShopItem;
}

function showFoodView(view) {
  ['pantry','list','links'].forEach(v => {
    document.getElementById(`food-view-${v}`).style.display = v === view ? 'block' : 'none';
  });
  document.getElementById('food-tab-pantry').className = view === 'pantry' ? 'btn btn-primary' : 'btn btn-ghost';
  document.getElementById('food-tab-list').className   = view === 'list'   ? 'btn btn-primary' : 'btn btn-ghost';
  document.getElementById('food-tab-links').className  = view === 'links'  ? 'btn btn-primary' : 'btn btn-ghost';
  if (view === 'pantry')  renderPantry();
  if (view === 'list')    renderShoppingList();
  if (view === 'links')   renderFoodLinks();
}

function renderPantry() {
  const items = Storage.getArray('ng_pantry');
  const container = document.getElementById('food-pantry-list');

  if (items.length === 0) {
    container.innerHTML = `<p style="padding:20px;color:var(--text-muted)">Your pantry is empty. Add items below.</p>`;
    return;
  }

  FOOD_CATEGORIES.forEach(cat => {
    const catItems = items.filter(i => i.category === cat);
    if (catItems.length === 0) return;
    let html = `<div style="padding:0 20px 4px;font-size:13px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px">${cat}</div>`;
    catItems.forEach(item => {
      const lowBg = item.lowStock ? 'background:#fff3e0;border-color:#ffcc80' : '';
      html += `
        <div class="card" style="margin:6px 20px;${lowBg}">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="flex:1">
              <div style="font-size:18px;font-weight:700">${item.name}</div>
              ${item.quantity ? `<div style="color:var(--text-muted);font-size:15px">Qty: ${item.quantity}</div>` : ''}
              ${item.lowStock ? `<div style="color:#b45309;font-size:14px;font-weight:700">⚠ Running low</div>` : ''}
            </div>
            <button class="btn btn-ghost" style="padding:8px 12px;flex-shrink:0" onclick="openFoodModal('${item.id}')" aria-label="Edit ${item.name}">Edit</button>
          </div>
        </div>`;
    });
    container.innerHTML += html;
  });

  // Handle items not yet rendered (if container was reset above we need full render)
  const rendered = FOOD_CATEGORIES.flatMap(cat => items.filter(i => i.category === cat));
  if (rendered.length < items.length) {
    const others = items.filter(i => !FOOD_CATEGORIES.includes(i.category));
    others.forEach(item => {
      container.innerHTML += `
        <div class="card" style="margin:6px 20px">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="flex:1"><div style="font-size:18px;font-weight:700">${item.name}</div></div>
            <button class="btn btn-ghost" style="padding:8px 12px" onclick="openFoodModal('${item.id}')">Edit</button>
          </div>
        </div>`;
    });
  }
}

function renderShoppingList() {
  const items = Storage.getArray('ng_shopping');
  const container = document.getElementById('food-shop-list');

  if (items.length === 0) {
    container.innerHTML = `<p style="padding:20px;color:var(--text-muted)">Your shopping list is empty.</p>`;
    return;
  }

  const needed = items.filter(i => !i.got);
  const got    = items.filter(i => i.got);

  let html = '';
  if (needed.length > 0) {
    html += `<div style="padding:0 20px 4px;font-size:13px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px">To Buy (${needed.length})</div>`;
    needed.forEach(item => {
      html += `
        <div class="card" style="margin:6px 20px">
          <div style="display:flex;align-items:center;gap:12px">
            <button onclick="toggleShopItem('${item.id}', false)"
              style="width:52px;height:52px;border-radius:10px;border:3px solid var(--border);background:white;font-size:24px;cursor:pointer;flex-shrink:0"
              aria-label="Mark ${item.name} as got">○</button>
            <div style="flex:1">
              <div style="font-size:18px;font-weight:700">${item.name}</div>
              ${item.qty ? `<div style="color:var(--text-muted);font-size:15px">${item.qty}</div>` : ''}
            </div>
            <button class="btn btn-ghost" style="padding:8px 12px;flex-shrink:0" onclick="openShopModal('${item.id}')">Edit</button>
          </div>
        </div>`;
    });
  }

  if (got.length > 0) {
    html += `<div style="padding:12px 20px 4px;font-size:13px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px">In Cart (${got.length})</div>`;
    got.forEach(item => {
      html += `
        <div class="card" style="margin:6px 20px;opacity:0.6">
          <div style="display:flex;align-items:center;gap:12px">
            <button onclick="toggleShopItem('${item.id}', true)"
              style="width:52px;height:52px;border-radius:10px;border:3px solid #4a7c59;background:#4a7c59;color:white;font-size:24px;cursor:pointer;flex-shrink:0"
              aria-label="Mark ${item.name} as not got">✓</button>
            <div style="flex:1;text-decoration:line-through">
              <div style="font-size:18px;font-weight:700">${item.name}</div>
            </div>
          </div>
        </div>`;
    });
    html += `<div style="padding:8px 20px">
      <button class="btn btn-ghost" style="width:100%" onclick="clearGotItems()">Clear checked items</button>
    </div>`;
  }

  container.innerHTML = html;
}

function toggleShopItem(id, currentlyGot) {
  const items = Storage.getArray('ng_shopping');
  const idx = items.findIndex(i => i.id === id);
  if (idx >= 0) { items[idx].got = !currentlyGot; Storage.set('ng_shopping', items); }
  renderShoppingList();
}

function clearGotItems() {
  const items = Storage.getArray('ng_shopping').filter(i => !i.got);
  Storage.set('ng_shopping', items);
  renderShoppingList();
}

function renderFoodLinks() {
  const links = Storage.getArray('ng_food_links');
  const container = document.getElementById('food-links-list');
  if (links.length === 0) {
    container.innerHTML = `<p style="padding:20px;color:var(--text-muted)">No links saved yet.</p>`;
    return;
  }
  container.innerHTML = links.map(l => `
    <div class="card" style="margin:8px 20px">
      <a href="${l.url}" target="_blank" rel="noopener noreferrer" style="font-size:18px;font-weight:700;color:var(--primary);text-decoration:none">${l.title}</a>
      ${l.description ? `<div style="color:var(--text-muted);font-size:15px;margin-top:4px">${l.description}</div>` : ''}
    </div>`).join('');
}

// Pantry item modal
function openFoodModal(id) {
  const modal = document.getElementById('food-modal');
  const item = id ? Storage.getArray('ng_pantry').find(x => x.id === id) : null;
  document.getElementById('food-modal-title').textContent = item ? 'Edit Item' : 'Add to Pantry';
  document.getElementById('food-item-id').value = id || '';
  document.getElementById('food-item-name').value = item?.name || '';
  document.getElementById('food-item-category').value = item?.category || FOOD_CATEGORIES[0];
  document.getElementById('food-item-qty').value = item?.quantity || '';
  document.getElementById('food-item-low').checked = item?.lowStock || false;
  document.getElementById('food-delete-btn').style.display = item ? 'inline-flex' : 'none';
  modal.showModal();
  document.getElementById('food-item-name').focus();
}

function closeFoodModal() { document.getElementById('food-modal').close(); }

function saveFoodItem() {
  const name = document.getElementById('food-item-name').value.trim();
  if (!name) { alert('Please enter an item name.'); return; }
  const id = document.getElementById('food-item-id').value;
  const item = {
    id: id || Storage.uid(),
    name,
    category: document.getElementById('food-item-category').value,
    quantity: document.getElementById('food-item-qty').value.trim(),
    lowStock: document.getElementById('food-item-low').checked
  };
  if (id) Storage.update('ng_pantry', id, item);
  else Storage.push('ng_pantry', item);
  closeFoodModal();
  renderPantry();
}

function deleteFoodItem() {
  const id = document.getElementById('food-item-id').value;
  if (!id || !confirm('Remove this item from your pantry?')) return;
  Storage.remove('ng_pantry', id);
  closeFoodModal();
  renderPantry();
}

// Shopping list item modal
function openShopModal(id) {
  const modal = document.getElementById('food-shop-modal');
  const item = id ? Storage.getArray('ng_shopping').find(x => x.id === id) : null;
  document.getElementById('food-shop-modal-title').textContent = item ? 'Edit Item' : 'Add to List';
  document.getElementById('food-shop-id').value = id || '';
  document.getElementById('food-shop-name').value = item?.name || '';
  document.getElementById('food-shop-qty').value = item?.qty || '';
  document.getElementById('food-shop-delete-btn').style.display = item ? 'inline-flex' : 'none';
  modal.showModal();
  document.getElementById('food-shop-name').focus();
}

function closeShopModal() { document.getElementById('food-shop-modal').close(); }

function saveShopItem() {
  const name = document.getElementById('food-shop-name').value.trim();
  if (!name) { alert('Please enter an item name.'); return; }
  const id = document.getElementById('food-shop-id').value;
  const item = { id: id || Storage.uid(), name, qty: document.getElementById('food-shop-qty').value.trim(), got: false };
  if (id) Storage.update('ng_shopping', id, item);
  else Storage.push('ng_shopping', item);
  closeShopModal();
  renderShoppingList();
}

function deleteShopItem() {
  const id = document.getElementById('food-shop-id').value;
  if (!id || !confirm('Remove this item from your list?')) return;
  Storage.remove('ng_shopping', id);
  closeShopModal();
  renderShoppingList();
}

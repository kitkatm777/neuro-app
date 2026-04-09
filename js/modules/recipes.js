// Task 14: Recipe Book
let recipesShowFavs = false;
let currentRecipeId = null;

function render_recipes() {
  recipesShowFavs = false;
  renderRecipesList();
  bindRecipeTabs();
  const addBtn = document.getElementById('recipes-add-btn');
  if (addBtn && !addBtn._bound) {
    addBtn._bound = true;
    addBtn.addEventListener('click', () => openRecipeModal());
    document.getElementById('recipes-save-btn').addEventListener('click', saveRecipe);
    document.getElementById('recipes-cancel-btn').addEventListener('click', closeRecipeModal);
    document.getElementById('recipes-delete-btn').addEventListener('click', deleteRecipe);
  }
}

function bindRecipeTabs() {
  const tabAll = document.getElementById('recipes-tab-all');
  const tabFavs = document.getElementById('recipes-tab-favs');
  if (!tabAll || tabAll._bound) return;
  tabAll._bound = true;
  tabAll.addEventListener('click', () => {
    recipesShowFavs = false;
    tabAll.className = 'btn btn-primary';
    tabFavs.className = 'btn btn-ghost';
    showRecipeList();
    renderRecipesList();
  });
  tabFavs.addEventListener('click', () => {
    recipesShowFavs = true;
    tabFavs.className = 'btn btn-primary';
    tabAll.className = 'btn btn-ghost';
    showRecipeList();
    renderRecipesList();
  });
}

function showRecipeList() {
  document.getElementById('recipes-list').style.display = '';
  document.getElementById('recipe-detail').style.display = 'none';
}

function renderRecipesList() {
  const list = document.getElementById('recipes-list');
  if (!list) return;
  let recipes = Storage.getArray('ng_recipes');
  if (recipesShowFavs) recipes = recipes.filter(r => r.favourite);
  if (!recipes.length) {
    list.innerHTML = `
      <div style="padding:32px 20px;text-align:center;color:var(--text-muted)">
        <div style="font-size:48px;margin-bottom:12px">🍲</div>
        <p style="font-size:20px;margin-bottom:8px">${recipesShowFavs ? 'No favourites yet' : 'No recipes yet'}</p>
        <p style="font-size:16px">${recipesShowFavs ? 'Star a recipe to add it here.' : 'Tap <strong>+ Add Recipe</strong> to get started.'}</p>
      </div>`;
    return;
  }
  // Group by category
  const cats = {};
  recipes.forEach(r => {
    const c = r.category || 'Other';
    if (!cats[c]) cats[c] = [];
    cats[c].push(r);
  });
  list.innerHTML = Object.entries(cats).map(([cat, items]) => `
    <div style="margin:0 20px 6px;font-size:13px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px">${cat}</div>
    ${items.map(r => `
      <div class="card" style="margin:0 20px 10px;cursor:pointer;display:flex;align-items:center;gap:14px"
        onclick="showRecipeDetail('${r.id}')" role="button" tabindex="0" aria-label="View recipe: ${r.name}">
        <div style="font-size:36px">${catEmoji(r.category)}</div>
        <div style="flex:1">
          <div style="font-size:19px;font-weight:700;color:var(--primary)">${r.name}</div>
          ${r.servings ? `<div style="font-size:14px;color:var(--text-muted)">Serves ${r.servings}</div>` : ''}
        </div>
        ${r.favourite ? '<div style="font-size:22px">⭐</div>' : ''}
      </div>`).join('')}
  `).join('');
}

function catEmoji(cat) {
  const map = { Breakfast:'🍳', Lunch:'🥗', Dinner:'🍽️', Snack:'🍎', Dessert:'🍰', Drink:'🥤' };
  return map[cat] || '🍲';
}

function showRecipeDetail(id) {
  const r = Storage.getArray('ng_recipes').find(x => x.id === id);
  if (!r) return;
  currentRecipeId = id;
  document.getElementById('recipes-list').style.display = 'none';
  const detail = document.getElementById('recipe-detail');
  detail.style.display = '';
  const ingredients = (r.ingredients || '').split('\n').filter(Boolean).map(i => `<li style="margin-bottom:6px;font-size:17px">${i}</li>`).join('');
  const steps = (r.steps || '').split('\n').filter(Boolean).map((s, i) => `<li style="margin-bottom:10px;font-size:17px"><strong>${i+1}.</strong> ${s}</li>`).join('');
  detail.innerHTML = `
    <div style="padding:0 20px 30px">
      <button class="btn btn-ghost" onclick="showRecipeList();renderRecipesList()" style="margin-bottom:12px">← Back to Recipes</button>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
        <div style="font-size:48px">${catEmoji(r.category)}</div>
        <div>
          <h2 style="font-size:26px;font-weight:800;color:var(--primary);margin:0">${r.name}</h2>
          <div style="font-size:15px;color:var(--text-muted)">${r.category}${r.servings ? ' · Serves '+r.servings : ''}</div>
        </div>
        ${r.favourite ? '<div style="font-size:28px;margin-left:auto">⭐</div>' : ''}
      </div>
      <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="openRecipeModal('${r.id}')">✏️ Edit</button>
        <button class="btn btn-ghost" onclick="toggleFavourite('${r.id}')">${r.favourite ? '★ Remove Favourite' : '☆ Add Favourite'}</button>
      </div>
      ${r.ingredients ? `
        <h3 style="font-size:20px;color:var(--secondary);margin-bottom:10px">Ingredients</h3>
        <ul style="padding-left:20px;margin-bottom:20px">${ingredients}</ul>` : ''}
      ${r.steps ? `
        <h3 style="font-size:20px;color:var(--secondary);margin-bottom:10px">Instructions</h3>
        <ol style="padding-left:20px;margin-bottom:20px">${steps}</ol>` : ''}
      ${r.notes ? `
        <div class="card" style="background:var(--bg);border-left:4px solid var(--accent)">
          <div style="font-size:14px;font-weight:700;color:var(--accent);margin-bottom:4px">TIPS</div>
          <div style="font-size:16px">${r.notes}</div>
        </div>` : ''}
    </div>`;
}

function toggleFavourite(id) {
  const r = Storage.getArray('ng_recipes').find(x => x.id === id);
  if (!r) return;
  Storage.update('ng_recipes', id, { favourite: !r.favourite });
  showRecipeDetail(id);
}

function openRecipeModal(id) {
  const modal = document.getElementById('recipes-modal');
  const titleEl = document.getElementById('recipes-modal-title');
  const del = document.getElementById('recipes-delete-btn');
  document.getElementById('recipe-id').value = '';
  document.getElementById('recipe-name').value = '';
  document.getElementById('recipe-category').value = 'Dinner';
  document.getElementById('recipe-servings').value = '';
  document.getElementById('recipe-ingredients').value = '';
  document.getElementById('recipe-steps').value = '';
  document.getElementById('recipe-notes').value = '';
  document.getElementById('recipe-fav').checked = false;
  del.style.display = 'none';
  if (id) {
    const r = Storage.getArray('ng_recipes').find(x => x.id === id);
    if (r) {
      document.getElementById('recipe-id').value = r.id;
      document.getElementById('recipe-name').value = r.name || '';
      document.getElementById('recipe-category').value = r.category || 'Dinner';
      document.getElementById('recipe-servings').value = r.servings || '';
      document.getElementById('recipe-ingredients').value = r.ingredients || '';
      document.getElementById('recipe-steps').value = r.steps || '';
      document.getElementById('recipe-notes').value = r.notes || '';
      document.getElementById('recipe-fav').checked = !!r.favourite;
      del.style.display = '';
    }
    titleEl.textContent = 'Edit Recipe';
  } else {
    titleEl.textContent = 'Add Recipe';
  }
  modal.showModal();
}

function closeRecipeModal() {
  document.getElementById('recipes-modal').close();
}

function saveRecipe() {
  const name = document.getElementById('recipe-name').value.trim();
  if (!name) { alert('Please enter a recipe name.'); return; }
  const id = document.getElementById('recipe-id').value;
  const rec = {
    id: id || Storage.uid(),
    name,
    category: document.getElementById('recipe-category').value,
    servings: document.getElementById('recipe-servings').value.trim(),
    ingredients: document.getElementById('recipe-ingredients').value.trim(),
    steps: document.getElementById('recipe-steps').value.trim(),
    notes: document.getElementById('recipe-notes').value.trim(),
    favourite: document.getElementById('recipe-fav').checked
  };
  if (id) {
    Storage.update('ng_recipes', id, rec);
  } else {
    Storage.push('ng_recipes', rec);
  }
  closeRecipeModal();
  renderRecipesList();
}

function deleteRecipe() {
  const id = document.getElementById('recipe-id').value;
  if (!id || !confirm('Delete this recipe?')) return;
  Storage.remove('ng_recipes', id);
  closeRecipeModal();
  showRecipeList();
  renderRecipesList();
}

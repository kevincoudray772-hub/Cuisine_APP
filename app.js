// --- Navigation ---
let currentView = 'accueil';

function navigate(view) {
  currentView = view;
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`nav-${view}`)?.classList.add('active');
  render();
}

function render() {
  const app = document.getElementById('app');
  switch (currentView) {
    case 'accueil':  app.innerHTML = renderAccueil(); break;
    case 'stock':    app.innerHTML = renderStock(); break;
    case 'recettes': app.innerHTML = renderRecettes(); break;
    case 'courses':  app.innerHTML = renderCourses(); break;
  }
}

// --- Accueil ---
function renderAccueil() {
  const stock = DB.getStock();
  const courses = DB.getCourses().filter(c => !c.done);
  const recettesDispo = getRecettesFaisables(stock);

  return `
    <h1>🍳 Recettes</h1>
    <p class="subtitle">Cuisinez avec ce que vous avez</p>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">${stock.length}</div>
        <div class="stat-label">Ingrédients en stock</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${recettesDispo.length}</div>
        <div class="stat-label">Recettes faisables</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${RECETTES.length}</div>
        <div class="stat-label">Recettes disponibles</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${courses.length}</div>
        <div class="stat-label">Articles à acheter</div>
      </div>
    </div>

    ${recettesDispo.length > 0 ? `
      <h2>✅ Vous pouvez cuisiner</h2>
      ${recettesDispo.slice(0, 2).map(r => renderRecetteCard(r, stock)).join('')}
      ${recettesDispo.length > 2 ? `
        <button class="btn btn-secondary" onclick="navigate('recettes')">
          Voir toutes les recettes →
        </button>
      ` : ''}
    ` : `
      <div class="empty-state">
        <div class="emoji">🥦</div>
        <p>Ajoutez des ingrédients à votre stock pour voir les recettes disponibles</p>
      </div>
      <button class="btn btn-primary" onclick="navigate('stock')">
        📦 Gérer mon stock
      </button>
    `}
  `;
}

// --- Stock ---
function renderStock() {
  const stock = DB.getStock();
  return `
    <h2>📦 Mon stock</h2>
    <button class="btn btn-primary" onclick="openScanner()">
      📷 Scanner un produit
    </button>
    <button class="btn btn-secondary" onclick="openAddManual()">
      ✏️ Ajouter manuellement
    </button>

    ${stock.length === 0 ? `
      <div class="empty-state">
        <div class="emoji">📦</div>
        <p>Votre stock est vide.<br>Scannez ou ajoutez vos ingrédients.</p>
      </div>
    ` : `
      <div class="card">
        ${stock.map(item => `
          <div class="ingredient-item">
            <div class="ingredient-info">
              <div class="ingredient-name">${item.name}</div>
              <div class="ingredient-qty">${item.quantity} ${item.unit}
                ${item.quantity <= item.threshold && item.threshold > 0
                  ? '<span class="badge badge-low">⚠️ Faible</span>' : ''}
              </div>
            </div>
            <div class="ingredient-actions">
              <button class="icon-btn" onclick="openEditIngredient(${item.id})">✏️</button>
              <button class="icon-btn" onclick="deleteIngredient(${item.id})">🗑️</button>
            </div>
          </div>
        `).join('')}
      </div>
    `}
  `;
}

function openScanner() {
  Scanner.start(async (barcode) => {
    showToast('🔍 Recherche du produit...');
    const product = await lookupBarcode(barcode);
    openAddIngredientModal(product.name, barcode);
  });
}

function openAddManual() {
  openAddIngredientModal('', '');
}

function openAddIngredientModal(name = '', barcode = '') {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'ingredient-modal';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-handle"></div>
      <h2>${name ? '📷 Produit détecté' : '➕ Ajouter un ingrédient'}</h2>
      <input type="text" id="ing-name" placeholder="Nom de l'ingrédient" value="${name}"/>
      <input type="number" id="ing-qty" placeholder="Quantité" value="1" min="0" step="0.1"/>
      <select id="ing-unit">
        <option value="unité(s)">unité(s)</option>
        <option value="g">grammes (g)</option>
        <option value="kg">kilogrammes (kg)</option>
        <option value="ml">millilitres (ml)</option>
        <option value="L">litres (L)</option>
        <option value="c.s.">cuillères à soupe</option>
        <option value="boîte(s)">boîte(s)</option>
        <option value="tranche(s)">tranche(s)</option>
        <option value="pincée(s)">pincée(s)</option>
      </select>
      <input type="number" id="ing-threshold" placeholder="Seuil alerte courses (ex: 2)" min="0"/>
      <button class="btn btn-primary" onclick="saveIngredient('${barcode}')">✅ Ajouter au stock</button>
      <button class="btn btn-secondary" onclick="closeModal()">Annuler</button>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('ing-name').focus();
}

function saveIngredient(barcode) {
  const name = document.getElementById('ing-name').value.trim();
  const quantity = parseFloat(document.getElementById('ing-qty').value) || 1;
  const unit = document.getElementById('ing-unit').value;
  const threshold = parseFloat(document.getElementById('ing-threshold').value) || 0;

  if (!name) { showToast('⚠️ Entrez un nom'); return; }

  DB.addIngredient({ name, quantity, unit, threshold, barcode });
  closeModal();
  showToast(`✅ ${name} ajouté au stock !`);
  render();
}

function openEditIngredient(id) {
  const stock = DB.getStock();
  const item = stock.find(i => i.id === id);
  if (!item) return;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'ingredient-modal';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-handle"></div>
      <h2>✏️ Modifier</h2>
      <input type="text" id="ing-name" placeholder="Nom" value="${item.name}"/>
      <input type="number" id="ing-qty" placeholder="Quantité" value="${item.quantity}" step="0.1"/>
      <select id="ing-unit">
        ${['unité(s)', 'g', 'kg', 'ml', 'L', 'c.s.', 'boîte(s)', 'tranche(s)', 'pincée(s)']
          .map(u => `<option value="${u}" ${u === item.unit ? 'selected' : ''}>${u}</option>`)
          .join('')}
      </select>
      <input type="number" id="ing-threshold" placeholder="Seuil alerte" value="${item.threshold || ''}" min="0"/>
      <button class="btn btn-primary" onclick="updateIngredient(${id})">✅ Enregistrer</button>
      <button class="btn btn-danger" onclick="deleteIngredient(${id})">🗑️ Supprimer</button>
      <button class="btn btn-secondary" onclick="closeModal()">Annuler</button>
    </div>
  `;
  document.body.appendChild(modal);
}

function updateIngredient(id) {
  DB.updateIngredient(id, {
    name: document.getElementById('ing-name').value.trim(),
    quantity: parseFloat(document.getElementById('ing-qty').value) || 0,
    unit: document.getElementById('ing-unit').value,
    threshold: parseFloat(document.getElementById('ing-threshold').value) || 0
  });
  closeModal();
  showToast('✅ Modifié !');
  render();
}

function deleteIngredient(id) {
  DB.deleteIngredient(id);
  closeModal();
  showToast('🗑️ Supprimé');
  render();
}

// --- Recettes ---
function getRecettesFaisables(stock) {
  return RECETTES.map(recette => {
    const dispo = recette.ingredients.filter(ing =>
      stock.some(s =>
        s.name.toLowerCase().trim() === ing.name.toLowerCase().trim() &&
        s.quantity >= ing.quantity
      )
    );
    return {
      ...recette,
      disponibles: dispo.length,
      total: recette.ingredients.length,
      manquants: recette.ingredients.filter(ing =>
        !stock.some(s =>
          s.name.toLowerCase().trim() === ing.name.toLowerCase().trim() &&
          s.quantity >= ing.quantity
        )
      )
    };
  }).sort((a, b) => (b.disponibles / b.total) - (a.disponibles / a.total));
}

function renderRecetteCard(recette, stock) {
  const pct = Math.round((recette.disponibles / recette.total) * 100);
  const canCook = recette.disponibles === recette.total;
  return `
    <div class="recette-card" onclick="openRecette(${recette.id})">
      <div class="recette-header">
        <div class="recette-emoji">${recette.emoji}</div>
        <div class="recette-title">${recette.nom}</div>
        <div class="recette-meta">⏱ ${recette.temps} · 👥 ${recette.personnes} pers.</div>
      </div>
      <div class="recette-body">
        <div class="ingredients-disponibles">
          ✅ ${recette.disponibles}/${recette.total} ingrédients disponibles
        </div>
        ${recette.manquants.length > 0 ? `
          <div class="ingredients-manquants">
            ❌ Manquants : ${recette.manquants.map(m => m.name).join(', ')}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function renderRecettes() {
  const stock = DB.getStock();
  const recettes = getRecettesFaisables(stock);
  const faisables = recettes.filter(r => r.disponibles === r.total);
  const partielles = recettes.filter(r => r.disponibles < r.total && r.disponibles > 0);
  const autres = recettes.filter(r => r.disponibles === 0);

  return `
    <h2>🍳 Recettes</h2>
    ${faisables.length > 0 ? `
      <h3 style="color: var(--success); margin-bottom: 8px;">✅ Vous pouvez cuisiner (${faisables.length})</h3>
      ${faisables.map(r => renderRecetteCard(r, stock)).join('')}
    ` : ''}
    ${partielles.length > 0 ? `
      <h3 style="color: #e07b00; margin: 12px 0 8px;">⚠️ Presque prêtes (${partielles.length})</h3>
      ${partielles.map(r => renderRecetteCard(r, stock)).join('')}
    ` : ''}
    ${autres.length > 0 ? `
      <h3 style="color: var(--muted); margin: 12px 0 8px;">❌ Ingrédients manquants (${autres.length})</h3>
      ${autres.map(r => renderRecetteCard(r, stock)).join('')}
    ` : ''}
  `;
}

function openRecette(id) {
  const stock = DB.getStock();
  const recette = getRecettesFaisables(stock).find(r => r.id === id);
  if (!recette) return;

  const canCook = recette.disponibles === recette.total;
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'recette-modal';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-handle"></div>
      <div style="font-size: 48px; text-align: center; margin-bottom: 8px;">${recette.emoji}</div>
      <h2 style="text-align: center;">${recette.nom}</h2>
      <p class="subtitle" style="text-align: center;">⏱ ${recette.temps} · 👥 ${recette.personnes} personnes</p>

      <h3 style="margin-bottom: 10px;">🛒 Ingrédients</h3>
      <div class="card" style="margin-bottom: 16px;">
        ${recette.ingredients.map(ing => {
          const inStock = stock.some(s =>
            s.name.toLowerCase().trim() === ing.name.toLowerCase().trim() &&
            s.quantity >= ing.quantity
          );
          return `
            <div class="ingredient-item">
              <span>${inStock ? '✅' : '❌'} ${ing.name}</span>
              <span style="color: var(--muted)">${ing.quantity} ${ing.unit}</span>
            </div>
          `;
        }).join('')}
      </div>

      <h3 style="margin-bottom: 12px;">👨‍🍳 Préparation</h3>
      ${recette.etapes.map((etape, i) => `
        <div class="step">
          <div class="step-number">${i + 1}</div>
          <div class="step-text">${etape}</div>
        </div>
      `).join('')}

      ${canCook ? `
        <button class="btn btn-success" style="margin-top: 16px" onclick="cuisiner(${id})">
          🍽️ J'ai cuisiné cette recette !
        </button>
      ` : `
        <button class="btn btn-secondary" style="margin-top: 16px" onclick="addMissingToCourses(${id})">
          🛒 Ajouter les manquants à ma liste de courses
        </button>
      `}
      <button class="btn btn-secondary" onclick="closeModal()">Fermer</button>
    </div>
  `;
  document.body.appendChild(modal);
}

function cuisiner(id) {
  const recette = RECETTES.find(r => r.id === id);
  if (!recette) return;
  DB.decrementIngredients(recette.ingredients);
  closeModal();
  showToast('🍽️ Bon appétit ! Stock mis à jour.');
  render();
}

function addMissingToCourses(id) {
  const stock = DB.getStock();
  const recette = getRecettesFaisables(stock).find(r => r.id === id);
  if (!recette) return;
  recette.manquants.forEach(ing => {
    const existing = DB.getCourses().find(c => c.name === ing.name);
    if (!existing) DB.addCourse({ name: ing.name, unit: ing.unit });
  });
  closeModal();
  showToast('🛒 Ajouté à la liste de courses !');
}

// --- Courses ---
function renderCourses() {
  const courses = DB.getCourses();
  const pending = courses.filter(c => !c.done);
  const done = courses.filter(c => c.done);

  return `
    <h2>🛒 Liste de courses</h2>
    <button class="btn btn-secondary" onclick="openAddCourse()">
      ➕ Ajouter un article
    </button>

    ${courses.length === 0 ? `
      <div class="empty-state">
        <div class="emoji">🛒</div>
        <p>Votre liste de courses est vide !<br>Les articles s'ajoutent automatiquement quand votre stock est faible.</p>
      </div>
    ` : `
      ${pending.length > 0 ? `
        <div class="card">
          ${pending.map(c => renderCourseItem(c)).join('')}
        </div>
      ` : ''}
      ${done.length > 0 ? `
        <h3 style="color: var(--muted); margin: 12px 0 8px;">✅ Déjà achetés (${done.length})</h3>
        <div class="card">
          ${done.map(c => renderCourseItem(c)).join('')}
        </div>
        <button class="btn btn-danger" onclick="clearDone()">
          🗑️ Supprimer les articles cochés
        </button>
      ` : ''}
    `}
  `;
}

function renderCourseItem(item) {
  return `
    <div class="course-item ${item.done ? 'done' : ''}">
      <input type="checkbox" id="course-${item.id}"
        ${item.done ? 'checked' : ''}
        onchange="toggleCourse(${item.id})"/>
      <label for="course-${item.id}" style="flex:1; cursor:pointer;">${item.name}</label>
      <button class="icon-btn" onclick="DB.deleteCourse(${item.id}); render();">🗑️</button>
    </div>
  `;
}

function toggleCourse(id) {
  DB.toggleCourse(id);
  render();
}

function clearDone() {
  DB.clearDoneCourses();
  render();
}

function openAddCourse() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'course-modal';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-handle"></div>
      <h2>➕ Ajouter un article</h2>
      <input type="text" id="course-name" placeholder="Ex: tomates, lait..."/>
      <button class="btn btn-primary" onclick="saveCourse()">✅ Ajouter</button>
      <button class="btn btn-secondary" onclick="closeModal()">Annuler</button>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => document.getElementById('course-name').focus(), 100);
}

function saveCourse() {
  const name = document.getElementById('course-name').value.trim();
  if (!name) return;
  DB.addCourse({ name, unit: '' });
  closeModal();
  render();
}

// --- Utilitaires ---
function closeModal() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.remove());
}

function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  render();
  // Fermer modal en cliquant sur l'overlay
  document.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) closeModal();
  });
});

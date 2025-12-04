// ===================================
// NIRD Academy - Candy Map Logic
// ===================================

// Check if logged in
if (!localStorage.getItem('token')) {
  window.location.href = '/index.html';
}

// Configuration des niveaux (Mise à jour : 5 mini-jeux)
const levels = [
  {
    id: 1,
    name: 'Dino',
    description: 'Le jeu du dinosaure (canard)',
    icon: '🦖',
  },
  {
    id: 2,
    name: 'Fruit Ninja',
    description: 'Tranchez les fruits',
    icon: '🍉',
  },
  { id: 3, name: 'Guitar Hero', description: 'Suivez le rythme', icon: '🎸' },
  {
    id: 4,
    name: 'Taupe Taupe',
    description: 'Attrapez les taupes (placeholder)',
    icon: '🐹',
  },
  {
    id: 5,
    name: 'Laser Game',
    description: 'Course laser (placeholder)',
    icon: '🔫',
  },
];

// État du jeu
let gameState = {
  currentLevel: 1,
  completedLevels: [],
  // xp removed
};

let currentUser = null;
let leaderboardData = [];
let pendingLevelScore = 0; // score achieved on last completed level
let pendingLevelId = null; // level id just completed
let levelThresholds = {}; // loaded from public/data/level_thresholds.json

// Positions des niveaux (adaptées à la map) — 5 niveaux
const levelPositions = [
  { x: 60, y: 460 },
  { x: 200, y: 360 },
  { x: 340, y: 420 },
  { x: 480, y: 300 },
  { x: 620, y: 380 },
];

// Mapping des jeux existants dans le dossier /jeux
const gameFiles = {
  1: '/jeux/canard.html', // Dino -> canard.html
  2: '/jeux/fruit-ninja.html', // Fruit Ninja
  3: '/jeux/guitar-hero.html', // Guitar Hero
  // 4 et 5 : pas de fichiers fournis, resteront placeholder
};

// ===== INITIALISATION =====
async function init() {
  await loadLevelThresholds();
  loadGameState();
  initMap();
  updateLevelInfo();
}

// Load per-level thresholds used to unlock progression
async function loadLevelThresholds() {
  try {
    const res = await fetch('/data/level_thresholds.json');
    if (res.ok) {
      const json = await res.json();
      levelThresholds = json || {};
      return;
    }
  } catch (e) {
    console.log(
      'Impossible de charger level_thresholds.json, valeurs par défaut utilisées',
    );
  }
  // fallback defaults if fetch fails
  levelThresholds = { 1: 50, 2: 100, 3: 150, 4: 200, 5: 250 };
}

// ===== GESTION DE L'ÉTAT =====
function loadGameState() {
  const saved = localStorage.getItem('candyMapState');
  if (saved) {
    gameState = JSON.parse(saved);
  }
}

function saveGameState() {
  localStorage.setItem('candyMapState', JSON.stringify(gameState));
}

// ===== INITIALISER LA CARTE =====
function initMap() {
  const mapContainer = document.getElementById('mapContainer');
  mapContainer.innerHTML = '';

  // Dessiner les chemins de connexion
  for (let i = 0; i < levels.length - 1; i++) {
    drawConnectionLine(
      levelPositions[i].x + 35,
      levelPositions[i].y + 35,
      levelPositions[i + 1].x + 35,
      levelPositions[i + 1].y + 35,
      mapContainer,
    );
  }

  // Créer les niveaux
  levels.forEach((level, index) => {
    const pathEl = document.createElement('div');
    pathEl.className = 'path';
    pathEl.style.left = levelPositions[index].x + 'px';
    pathEl.style.top = levelPositions[index].y + 'px';
    pathEl.id = 'level-' + level.id;

    // Déterminer l'état du niveau
    if (gameState.completedLevels.includes(level.id)) {
      pathEl.classList.add('completed');
    } else if (level.id === gameState.currentLevel) {
      pathEl.classList.add('current');
    } else if (level.id > gameState.currentLevel) {
      pathEl.classList.add('locked');
    }

    pathEl.innerHTML = `${level.icon}<div style="font-size: 0.6em; font-weight: 900;">${level.id}</div>`;
    pathEl.onclick = () => selectLevel(level.id);

    mapContainer.appendChild(pathEl);
  });

  // Ajouter le joueur
  const player = document.createElement('div');
  player.className = 'player';
  player.id = 'player';
  player.innerHTML = '🎮';

  const currentPos = levelPositions[gameState.currentLevel - 1];
  player.style.left = currentPos.x + 7.5 + 'px';
  player.style.top = currentPos.y + 7.5 + 'px';

  mapContainer.appendChild(player);

  updateStats();
}

// Dessiner une ligne de connexion
function drawConnectionLine(x1, y1, x2, y2, container) {
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  const line = document.createElement('div');
  line.className = 'path-line';
  line.style.width = distance + 'px';
  line.style.height = '8px';
  line.style.left = x1 + 'px';
  line.style.top = y1 + 'px';
  line.style.transform = `rotate(${angle}deg)`;
  line.style.transformOrigin = '0 0';

  container.appendChild(line);
}

// ===== SÉLECTIONNER UN NIVEAU =====
function selectLevel(levelId) {
  // Vérifier si on peut accéder au niveau
  if (
    levelId > gameState.currentLevel &&
    !gameState.completedLevels.includes(levelId - 1)
  ) {
    alert("🔒 Vous devez d'abord compléter le niveau précédent!");
    return;
  }

  gameState.currentLevel = levelId;
  updateLevelInfo();
  initMap();
}

// ===== METTRE À JOUR LES INFOS =====
function updateLevelInfo() {
  const level = levels[gameState.currentLevel - 1];
  const info = document.getElementById('levelInfo');
  info.innerHTML = `
        <h3>${level.icon} ${level.name}</h3>
        <p>${level.description}</p>
    `;
}

function updateStats() {
  document.getElementById('currentLevel').textContent = gameState.currentLevel;
  document.getElementById('completedCount').textContent =
    gameState.completedLevels.length + '/' + levels.length;
}

// ===== JOUER UN NIVEAU =====
function playLevel() {
  const levelId = gameState.currentLevel;
  const level = levels[levelId - 1];

  // If there's a real game file, open it in a new tab; otherwise show placeholder alert
  const gameFile = gameFiles[levelId];
  if (gameFile) {
    try {
      // Open the game in a new tab/window WITHOUT 'noopener' so the child can postMessage back to opener
      window.open(gameFile, '_blank');
    } catch (e) {
      // fallback
      alert(
        `🎮 Niveau ${levelId}: ${level.name}\n\n(Le jeu s'ouvrira dans un nouvel onglet)`,
      );
    }
    // For real game files we wait for the child window to post back the score
    return;
  } else {
    alert(
      `🎮 Niveau ${levelId}: ${level.name}\n\nLe contenu du jeu sera intégré ici...`,
    );
  }

  // Compléter le niveau
  if (!gameState.completedLevels.includes(levelId)) {
    // simulate a level score (replace with real game score when available)
    const levelScore = 100 * levelId + Math.floor(Math.random() * 100); // placeholder score
    pendingLevelScore = levelScore;
    pendingLevelId = levelId;

    const threshold =
      parseInt(
        levelThresholds[levelId] || levelThresholds[String(levelId)] || 0,
        10,
      ) || 0;
    let unlocked = false;
    if (levelScore >= threshold) {
      // mark completed and advance
      if (!gameState.completedLevels.includes(levelId)) {
        gameState.completedLevels.push(levelId);
      }
      if (levelId < levels.length) {
        gameState.currentLevel = Math.max(gameState.currentLevel, levelId + 1);
      }
      unlocked = true;
    }

    saveGameState();
    initMap();
    updateLevelInfo();

    // If the user is already logged in, save score immediately for the completed level (or partial score)
    setTimeout(() => {
      if (currentUser) {
        localStorage.setItem('nirdUser', JSON.stringify(currentUser));
        saveScoreForUser(currentUser, pendingLevelId, pendingLevelScore);
        showLeaderboard(pendingLevelId);
        if (unlocked)
          alert(
            `✨ Score enregistré et niveau débloqué pour ${currentUser.username} (${pendingLevelScore})`,
          );
        else
          alert(
            `⚠️ Score enregistré (${pendingLevelScore}). Score minimum pour débloquer le niveau suivant: ${threshold}`,
          );
      } else {
        // otherwise open auth modal to register the score
        openAuthModal();
      }
    }, 600);
  } else {
    alert('✓ Ce niveau est déjà complété!');
  }
}

// ===== RÉINITIALISER =====
function resetProgress() {
  if (confirm('⚠️ Êtes-vous sûr? Cette action est irréversible.')) {
    gameState = {
      currentLevel: 1,
      completedLevels: [],
    };
    saveGameState();
    initMap();
    updateLevelInfo();
    alert('✨ Progression réinitialisée!');
  }
}

// ===== AUTHENTIFICATION & LEADERBOARD =====
function openAuthModal() {
  document.getElementById('authModal').classList.remove('hidden');
  // Prefill the level score display and hidden input
  document.getElementById('authForm').reset();
  // Prefill the level score display and hidden input
  const scoreDisplay = document.getElementById('levelScoreDisplay');
  const scoreInput = document.getElementById('levelScore');
  if (scoreDisplay) scoreDisplay.textContent = pendingLevelScore || 0;
  if (scoreInput) scoreInput.value = pendingLevelScore || 0;
}

function closeAuthModal() {
  document.getElementById('authModal').classList.add('hidden');
}

function closeLeaderboardModal() {
  document.getElementById('leaderboardModal').classList.add('hidden');
}

async function submitAuth(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const school = document.getElementById('school').value;
  // Use the pendingLevelId (the level that was just completed)
  const levelId = pendingLevelId || gameState.currentLevel;
  // read submitted level score (prefilled)
  const levelScoreInput = document.getElementById('levelScore');
  const levelScore =
    parseInt(levelScoreInput && levelScoreInput.value) ||
    pendingLevelScore ||
    0;

  // Capture the completed level ID BEFORE anything else
  const completedLevelId = levelId;

  // Créer l'objet utilisateur
  currentUser = {
    username,
    email,
    school,
    completedLevels: gameState.completedLevels.length,
    level: levelId,
    score: levelScore,
    timestamp: new Date().toISOString(),
  };

  // Sauvegarder dans localStorage (utilisateur)
  localStorage.setItem('nirdUser', JSON.stringify(currentUser));

  // Ajouter au leaderboard local pour ce niveau — garder le meilleur score par email
  saveScoreForUser(currentUser, levelId, levelScore);

  // Envoyer au serveur (optionnel - pour la BDD)
  try {
    await fetch('/api/leaderboard/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentUser),
    }).catch((err) => console.log('BDD non disponible, mode local'));
  } catch (err) {
    console.log('Score sauvegardé localement');
  }

  closeAuthModal();
  // Use the captured completedLevelId (not pendingLevelId which is now cleared)
  showLeaderboard(completedLevelId);
  alert(
    `✨ Bravo ${username}!\nVotre score a été enregistré pour le niveau ${completedLevelId}!`,
  );
}

async function showLeaderboard(levelId = null) {
  // levelId par défaut = niveau courant
  if (!levelId) levelId = gameState.currentLevel;

  let remoteData = [];
  // Récupérer les données du leaderboard (depuis la BDD ou localStorage par niveau)
  try {
    const res = await fetch(`/api/leaderboard?level=${levelId}`);
    if (res.ok) remoteData = await res.json();
  } catch (err) {
    // ignore, on utilisera local
  }

  const key = `leaderboardData_level_${levelId}`;
  const local = JSON.parse(localStorage.getItem(key) || '[]');

  // Prioriser remote si présent, sinon local
  leaderboardData = remoteData && remoteData.length ? remoteData : local;

  // Ajouter l'utilisateur actuel s'il existe et n'est pas déjà présent
  if (
    currentUser &&
    currentUser.level === levelId &&
    !leaderboardData.find((u) => u.email === currentUser.email)
  ) {
    leaderboardData.push(currentUser);
  }

  // Trier par score décroissant
  leaderboardData.sort((a, b) => (b.score || 0) - (a.score || 0));

  // Sauvegarder localement
  localStorage.setItem(key, JSON.stringify(leaderboardData));

  // Afficher le leaderboard
  displayLeaderboard(levelId);
  document.getElementById('leaderboardModal').classList.remove('hidden');
}

function displayLeaderboard(levelId) {
  const content = document.getElementById('leaderboardContent');
  const level = levels.find((l) => l.id === levelId) || {
    name: `Niveau ${levelId}`,
  };

  let html = `<div style="margin-bottom:12px;font-weight:800;color:var(--primary);">Leaderboard — ${level.icon} ${level.name}</div>`;
  html += '<div class="leaderboard-header">';
  html += '<div>Rang</div>';
  html += '<div>Pseudo</div>';
  html += '<div>École</div>';
  html += '<div>Score</div>';
  html += '</div>';

  if (!leaderboardData || leaderboardData.length === 0) {
    html +=
      '<div style="padding:16px;text-align:center;color:var(--neutral);">Aucun score pour ce niveau — soyez le premier !</div>';
  } else {
    leaderboardData.slice(0, 50).forEach((user, index) => {
      let rankClass = '';
      if (index === 0) rankClass = 'top-1 medal-1';
      else if (index === 1) rankClass = 'top-2 medal-2';
      else if (index === 2) rankClass = 'top-3 medal-3';

      html += `<div class="leaderboard-row ${rankClass}">`;
      html += `<div class="leaderboard-rank">${index + 1}</div>`;
      html += `<div class="leaderboard-name">${user.username}</div>`;
      html += `<div class="leaderboard-school">${user.school || '-'}</div>`;
      const displayScore = user.score != null ? `${user.score}` : `-`;
      html += `<div class="leaderboard-score">${displayScore}</div>`;
      html += '</div>';
    });
  }

  content.innerHTML = html;
}

// Save a score for a user for a specific level (keep best score per email)
function saveScoreForUser(user, levelId, levelScore) {
  if (!user || !user.email) return;
  const key = `leaderboardData_level_${levelId}`;
  const local = JSON.parse(localStorage.getItem(key) || '[]');
  const now = new Date().toISOString();

  let entry = local.find((u) => u.email === user.email);
  if (!entry) {
    entry = {
      username: user.username,
      email: user.email,
      school: user.school || '',
      score: levelScore,
      timestamp: now,
      level: levelId,
    };
    local.push(entry);
  } else {
    // update only if new score is better
    if ((levelScore || 0) > (entry.score || 0)) {
      entry.score = levelScore;
      entry.timestamp = now;
    }
  }

  // sort by score desc
  local.sort((a, b) => (b.score || 0) - (a.score || 0));
  localStorage.setItem(key, JSON.stringify(local));

  // attempt to POST to server endpoint (non-blocking)
  try {
    fetch('/api/leaderboard/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: entry.username,
        email: entry.email,
        school: entry.school,
        score: entry.score,
        level: levelId,
      }),
    }).catch(() => {
      /* ignore */
    });
  } catch (e) {
    // ignore
  }
  // clear pending values
  pendingLevelId = null;
  pendingLevelScore = 0;
}

// Charger l'utilisateur actuel au démarrage
function loadCurrentUser() {
  const saved = localStorage.getItem('nirdUser');
  if (saved) {
    currentUser = JSON.parse(saved);
  }
}

// Profile UI helpers
function renderProfileArea() {
  const panel = document.getElementById('userPanel');
  if (!panel) return;
  panel.innerHTML = '';

  if (currentUser) {
    // Header with user info
    const header = document.createElement('div');
    header.className = 'user-panel-header';
    header.innerHTML = `👤 ${currentUser.username}`;
    panel.appendChild(header);

    // User details
    const content = document.createElement('div');
    content.className = 'user-panel-content';
    content.innerHTML = `
            <p><strong>Email:</strong><br>${currentUser.email}</p>
            <p><strong>École:</strong><br>${currentUser.school || '-'}</p>
        `;
    panel.appendChild(content);

    // Action buttons
    const actions = document.createElement('div');
    actions.className = 'user-panel-actions';

    const viewProfileBtn = document.createElement('button');
    viewProfileBtn.className = 'btn-panel-primary';
    viewProfileBtn.textContent = '📊 Voir profil détaillé';
    viewProfileBtn.addEventListener('click', () => openProfileModal());

    const myScoresBtn = document.createElement('button');
    myScoresBtn.className = 'btn-panel-secondary';
    myScoresBtn.textContent = '🏆 Mes meilleurs scores';
    myScoresBtn.addEventListener('click', () => showMyAllScores());

    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn-panel-danger';
    logoutBtn.textContent = '🚪 Se déconnecter';
    logoutBtn.addEventListener('click', () => logout());

    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn-panel-secondary';
    resetBtn.textContent = '⚠️ Reset données';
    resetBtn.addEventListener('click', () => clearAppStorage());

    actions.appendChild(viewProfileBtn);
    actions.appendChild(myScoresBtn);
    actions.appendChild(logoutBtn);
    actions.appendChild(resetBtn);

    panel.appendChild(actions);
    panel.classList.remove('hidden');
  } else {
    // Not logged in
    const header = document.createElement('div');
    header.className = 'user-panel-header';
    header.innerHTML = '🎮 Pas connecté';
    panel.appendChild(header);

    const content = document.createElement('div');
    content.className = 'user-panel-content';
    content.innerHTML = '<p>Connectez-vous pour enregistrer vos scores !</p>';
    panel.appendChild(content);

    const loginBtn = document.createElement('button');
    loginBtn.className = 'btn-panel-primary';
    loginBtn.textContent = '✓ Se connecter';
    loginBtn.addEventListener('click', () => openAuthModal());

    const actions = document.createElement('div');
    actions.className = 'user-panel-actions';
    actions.appendChild(loginBtn);

    panel.appendChild(actions);
    panel.classList.remove('hidden');
  }
}

function openProfileModal() {
  const modal = document.getElementById('profileModal');
  const content = document.getElementById('profileContent');
  if (!modal || !content) return;
  if (!currentUser) {
    content.innerHTML = '<div>Aucun utilisateur connecté.</div>';
  } else {
    content.innerHTML = `
            <p><strong>Pseudo:</strong> ${currentUser.username}</p>
            <p><strong>Email:</strong> ${currentUser.email}</p>
            <p><strong>École:</strong> ${currentUser.school || '-'}</p>
        `;
  }
  modal.classList.remove('hidden');
}

function closeProfileModal() {
  const modal = document.getElementById('profileModal');
  if (modal) modal.classList.add('hidden');
}

// Show all scores for current user across all levels
function showMyAllScores() {
  if (!currentUser) {
    alert("Connectez-vous d'abord");
    return;
  }

  // Collect all scores from all levels
  const allScores = [];
  for (let levelId = 1; levelId <= levels.length; levelId++) {
    const key = `leaderboardData_level_${levelId}`;
    const local = JSON.parse(localStorage.getItem(key) || '[]');
    const myEntry = local.find((u) => u.email === currentUser.email);
    if (myEntry) {
      allScores.push({
        level: levelId,
        levelName: levels[levelId - 1]?.name || `Niveau ${levelId}`,
        levelIcon: levels[levelId - 1]?.icon || '🎮',
        score: myEntry.score || 0,
        rank: local.indexOf(myEntry) + 1,
      });
    }
  }

  // Display in modal
  const content = document.getElementById('leaderboardContent');
  let html = `<div style="margin-bottom:12px;font-weight:800;color:var(--primary);">Mes meilleurs scores</div>`;
  html += '<div class="leaderboard-header">';
  html += '<div>Niveau</div>';
  html += '<div>Score</div>';
  html += '<div>Rang</div>';
  html += '</div>';

  if (allScores.length === 0) {
    html +=
      '<div style="padding:16px;text-align:center;color:var(--neutral);">Aucun score enregistré.</div>';
  } else {
    allScores.forEach((s) => {
      html += `<div class="leaderboard-row">`;
      html += `<div>${s.levelIcon} ${s.levelName}</div>`;
      html += `<div style="text-align:center;">${s.score}</div>`;
      html += `<div style="text-align:center;">#${s.rank}</div>`;
      html += '</div>';
    });
  }

  content.innerHTML = html;
  document.getElementById('leaderboardModal').classList.remove('hidden');
}

function logout() {
  localStorage.removeItem('nirdUser');
  currentUser = null;
  renderProfileArea();
  alert('Déconnecté.');
}

function clearAppStorage() {
  if (
    !confirm(
      'Supprimer toutes les données locales (profil, progression, leaderboards) ?',
    )
  )
    return;
  localStorage.removeItem('nirdUser');
  localStorage.removeItem('candyMapState');
  // remove all leaderboard keys
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const k = localStorage.key(i);
    if (k && k.startsWith('leaderboardData_level_')) localStorage.removeItem(k);
  }
  alert('Local storage nettoyé.');
  location.reload();
}

// Lancer l'application
document.addEventListener('DOMContentLoaded', () => {
  loadCurrentUser();
  renderProfileArea();
  // check URL param ?reset=1 to clear storage immediately
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('reset') === '1') {
      clearAppStorage();
      return;
    }
  } catch (e) {}
  init();
});

// Listen for scores posted by child game windows (via window.open)
window.addEventListener('message', (e) => {
  try {
    const data = e.data;
    if (!data || data.type !== 'nird-game-score') return;
    const lvl = parseInt(data.level, 10);
    const sc = parseInt(data.score, 10) || 0;

    // set pending values so auth modal can prefill
    pendingLevelId = lvl;
    pendingLevelScore = sc;

    const threshold =
      parseInt(levelThresholds[lvl] || levelThresholds[String(lvl)] || 0, 10) ||
      0;
    let unlocked = false;
    // mark level completed locally only if score meets threshold
    if (sc >= threshold) {
      if (!gameState.completedLevels.includes(lvl)) {
        gameState.completedLevels.push(lvl);
      }
      if (lvl < levels.length) {
        gameState.currentLevel = Math.max(gameState.currentLevel, lvl + 1);
      }
      saveGameState();
      initMap();
      updateLevelInfo();
      unlocked = true;
    }

    // If user logged in, save immediately; otherwise open auth modal
    if (currentUser) {
      localStorage.setItem('nirdUser', JSON.stringify(currentUser));
      saveScoreForUser(currentUser, lvl, sc);
      showLeaderboard(lvl);
      if (unlocked)
        alert(
          `✨ Score enregistré et niveau débloqué pour ${currentUser.username} (${sc})`,
        );
      else
        alert(
          `⚠️ Score enregistré (${sc}). Score minimum pour débloquer le niveau suivant: ${threshold}`,
        );
    } else {
      openAuthModal();
    }
  } catch (err) {
    console.log('Erreur en traitant le message du jeu', err);
  }
});

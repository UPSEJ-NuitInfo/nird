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

// Toast helper: shows non-blocking popups top-right
function ensureToastContainer() {
  let c = document.getElementById('toastContainer');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toastContainer';
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
  return c;
}

function showToast(message, type = 'info', timeout = 3600) {
  try {
    const container = ensureToastContainer();
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerText = message;
    container.appendChild(t);
    // Auto-remove
    setTimeout(() => {
      t.style.transition = 'opacity 0.25s, transform 0.25s';
      t.style.opacity = '0';
      t.style.transform = 'translateY(-6px)';
      setTimeout(() => t.remove(), 260);
    }, timeout);
    return t;
  } catch (e) {
    console.log('Toast error', e);
  }
}

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
  4: '/jeux/tape-taupe.html', // Taupe Taupe (Whack-a-GAFAM)
  5: '/jeux/laser-game.html', // Laser Game (Moodle Defender)
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
  const mapContainer = document.getElementById('mapStage') || document.getElementById('mapContainer');
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
    showToast("🔒 Vous devez d'abord compléter le niveau précédent!", 'warning');
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
    // Navigate directly to the game route (no iframe/modal)
    try {
      window.location.href = gameFile;
    } catch (e) {
      showToast(`🎮 Niveau ${levelId}: ${level.name}\n\n(Le jeu s'ouvrira dans un nouvel onglet)`, 'info');
    }
    // The game page will redirect back to /map?level=<id>&score=<score>
    return;
  } else {
    showToast(`🎮 Niveau ${levelId}: ${level.name}\n\nLe contenu du jeu sera intégré ici...`, 'info');
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
    setTimeout(async () => {
      if (currentUser && localStorage.getItem('token')) {
        await saveScoreForUser(pendingLevelId, pendingLevelScore);
        showLeaderboard(pendingLevelId);
        if (unlocked)
          showToast(`✨ Score enregistré et niveau débloqué pour ${currentUser.username} (${pendingLevelScore})`, 'info');
        else
          showToast(`⚠️ Score enregistré (${pendingLevelScore}). Score minimum pour débloquer le niveau suivant: ${threshold}`, 'warning');
      } else {
        // otherwise prompt to login
        showToast("⚠️ Vous devez être connecté pour sauvegarder vos scores.", 'warning');
        setTimeout(() => (window.location.href = '/index.html'), 350);
      }
    }, 600);
  } else {
    showToast('✓ Ce niveau est déjà complété!', 'info');
  }
}

// (iframe/modal launch removed — games are opened via direct navigation to `/jeux/*`)

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
    showToast('✨ Progression réinitialisée!', 'info');
  }
}

// ===== LEADERBOARD =====
function closeLeaderboardModal() {
  const lb = document.getElementById('leaderboardModal');
  if (lb) {
    lb.classList.add('hidden');
    lb.style.zIndex = '';
  }
  const profile = document.getElementById('profileModal');
  if (profile) profile.style.zIndex = '11100';
}

async function showLeaderboard(levelId = null) {
  // levelId par défaut = niveau courant
  if (!levelId) levelId = gameState.currentLevel;

  const token = localStorage.getItem('token');
  leaderboardData = [];

  // Récupérer le classement depuis l'API (utilise le gameId = levelId)
  try {
    const res = await fetch(`/api/games/${levelId}/leaderboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      const data = await res.json();
      leaderboardData = data.leaderboard || [];
    }
  } catch (err) {
    console.error('Erreur chargement leaderboard:', err);
  }

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
  html += '<div>Score</div>';
  html += '</div>';

  if (!leaderboardData || leaderboardData.length === 0) {
    html +=
      '<div style="padding:16px;text-align:center;color:var(--neutral);">Aucun score pour ce niveau — soyez le premier !</div>';
  } else {
    leaderboardData.slice(0, 50).forEach((entry) => {
      let rankClass = '';
      if (entry.rank === 1) rankClass = 'top-1 medal-1';
      else if (entry.rank === 2) rankClass = 'top-2 medal-2';
      else if (entry.rank === 3) rankClass = 'top-3 medal-3';

      html += `<div class="leaderboard-row ${rankClass}">`;
      html += `<div class="leaderboard-rank">${entry.rank}</div>`;
      html += `<div class="leaderboard-name">${entry.username}</div>`;
      const displayScore = entry.score != null ? `${entry.score}` : `-`;
      html += `<div class="leaderboard-score">${displayScore}</div>`;
      html += '</div>';
    });
  }

  content.innerHTML = html;
}

// Save a score for a user to a specific level (gameId = levelId) via API
async function saveScoreForUser(levelId, levelScore) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token manquant, score non sauvegardé');
    return;
  }

  try {
    const res = await fetch(`/api/games/${levelId}/score`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ score: levelScore }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(
        `Score ${levelScore} enregistré pour le niveau ${levelId}: ${data.message}`,
      );
      return data;
    } else {
      console.error("Erreur lors de l'enregistrement du score:", res.status);
    }
  } catch (err) {
    console.error('Erreur saveScoreForUser:', err);
  }

  // clear pending values
  pendingLevelId = null;
  pendingLevelScore = 0;
}

// Load current user from JWT token (stored in localStorage)
function loadCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) {
    // No token = not logged in, redirect handled at top of file
    return;
  }

  try {
    // Decode JWT to extract user info (basic decode, no verification needed client-side)
    const parts = token.split('.');
    if (parts.length !== 3) return;
    const payload = JSON.parse(atob(parts[1]));
    currentUser = {
      id: payload.id,
      username: payload.username,
    };
  } catch (err) {
    console.error('Erreur décodage JWT:', err);
  }
}

// Profile UI helpers
function renderProfileArea() {
  // Render profile as a single button in the top-right `#profileArea`.
  const topArea = document.getElementById('profileArea');
  const fixedPanel = document.getElementById('userPanel');
  if (fixedPanel) fixedPanel.classList.add('hidden');
  if (!topArea) return;
  topArea.innerHTML = '';

  if (currentUser) {
    const btn = document.createElement('button');
    btn.className = 'profile-btn';
    const avatar = (currentUser.username || 'U').charAt(0).toUpperCase();
    btn.innerHTML = `<span class="profile-avatar">${avatar}</span><span class="profile-name">${currentUser.username}</span>`;
    btn.addEventListener('click', () => openProfileModal());
    topArea.appendChild(btn);
  } else {
    const loginBtn = document.createElement('button');
    loginBtn.className = 'profile-btn';
    loginBtn.innerHTML = `<span class="profile-avatar">👤</span><span class="profile-name">Se connecter</span>`;
    loginBtn.addEventListener('click', () => (window.location.href = '/index.html'));
    topArea.appendChild(loginBtn);
  }
}

function openProfileModal() {
  const modal = document.getElementById('profileModal');
  const content = document.getElementById('profileContent');
  if (!modal || !content) return;
  const actions = modal.querySelector('.modal-actions');
  if (!currentUser) {
    content.innerHTML = '<div>Aucun utilisateur connecté.</div>';
    if (actions) {
      actions.innerHTML = `
        <button class="btn btn-secondary" onclick="closeProfileModalClean()">Fermer</button>
        <button class="btn btn-primary" onclick="window.location.href='/index.html'">Se connecter</button>
      `;
    }
  } else {
    content.innerHTML = `
            <p><strong>Pseudo:</strong> ${currentUser.username}</p>
        `;
    if (actions) {
      actions.innerHTML = `
        <button class="btn btn-secondary" onclick="closeProfileModalClean()">Fermer</button>
        <button class="btn btn-primary" onclick="showMyAllScores()">Mes meilleurs scores</button>
        <button class="btn btn-danger" onclick="logout()">Se déconnecter</button>
      `;
    }
  }
  // enlarge profile modal for readability
  const modalContent = modal.querySelector('.modal-content');
  if (modalContent) modalContent.classList.add('modal-large');
  modal.classList.remove('hidden');
}

function closeProfileModal() {
  const modal = document.getElementById('profileModal');
  if (modal) modal.classList.add('hidden');
}

// Ensure we remove any modal-large class when closing profile modal
function closeProfileModalClean() {
  const modal = document.getElementById('profileModal');
  if (!modal) return;
  const modalContent = modal.querySelector('.modal-content');
  if (modalContent) modalContent.classList.remove('modal-large');
  modal.classList.add('hidden');
}

// Show all scores for current user across all levels
async function showMyAllScores() {
  if (!currentUser) {
    showToast("Connectez-vous d'abord", 'warning');
    return;
  }

  const token = localStorage.getItem('token');
  const allScores = [];

  try {
    const res = await fetch(`/api/users/${currentUser.id}/scores`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      const data = await res.json();
      // data.scores is an array of { gameId, gameName, score, updatedAt }
      if (data.scores && data.scores.length > 0) {
        data.scores.forEach((s) => {
          const level = levels.find((l) => l.id === s.gameId);
          allScores.push({
            gameId: s.gameId,
            gameName: s.gameName || `Niveau ${s.gameId}`,
            levelIcon: level?.icon || '🎮',
            score: s.score || 0,
          });
        });
      }
    }
  } catch (err) {
    console.error('Erreur chargement mes scores:', err);
  }

  // Display in modal
  const content = document.getElementById('leaderboardContent');
  let html = `<div style="margin-bottom:12px;font-weight:800;color:var(--primary);">Mes meilleurs scores</div>`;
  html += '<div class="leaderboard-header">';
  html += '<div>Niveau</div>';
  html += '<div>Score</div>';
  html += '</div>';

  if (allScores.length === 0) {
    html +=
      '<div style="padding:16px;text-align:center;color:var(--neutral);">Aucun score enregistré.</div>';
  } else {
    allScores.forEach((s) => {
      html += `<div class="leaderboard-row">`;
      html += `<div>${s.levelIcon} ${s.gameName}</div>`;
      html += `<div style="text-align:center;">${s.score}</div>`;
      html += '</div>';
    });
  }

  content.innerHTML = html;
  const lbModal = document.getElementById('leaderboardModal');
  const profileModalEl = document.getElementById('profileModal');
  // ensure leaderboard appears above profile modal
  if (profileModalEl) profileModalEl.style.zIndex = '11100';
  if (lbModal) {
    lbModal.style.zIndex = '11200';
    lbModal.classList.remove('hidden');
  }
}

function logout() {
  localStorage.removeItem('token');
  currentUser = null;
  renderProfileArea();
  showToast('Déconnecté.', 'info');
  setTimeout(() => (window.location.href = '/index.html'), 350);
}

function clearAppStorage() {
  if (
    !confirm(
      'Supprimer toutes les données locales (progression, leaderboards locaux) ?',
    )
  )
    return;
  localStorage.removeItem('candyMapState');
  // remove all old leaderboard keys (for cleanup)
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const k = localStorage.key(i);
    if (k && k.startsWith('leaderboardData_level_')) localStorage.removeItem(k);
  }
  showToast('Progression locale nettoyée.', 'info');
  setTimeout(() => location.reload(), 450);
}

// Lancer l'application
document.addEventListener('DOMContentLoaded', async () => {
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

  // init (loads thresholds, state, UI)
  await init();

  // After init, check URL params for an incoming score (from a game redirect)
  try {
    const params = new URLSearchParams(window.location.search);
    const lvl = params.has('level') ? parseInt(params.get('level'), 10) : null;
    const sc = params.has('score') ? parseInt(params.get('score'), 10) : null;
    if (lvl && !isNaN(sc)) {
      // handle the incoming score and then remove params from URL
      await handleGameScore(lvl, sc);
      // Clean the URL to avoid reprocessing on refresh
      const url = new URL(window.location.href);
      url.searchParams.delete('level');
      url.searchParams.delete('score');
      history.replaceState({}, document.title, url.pathname + url.search);
    }
  } catch (e) {
    console.error('Erreur parsing URL params:', e);
  }
});

// Listen for scores posted by child game windows (via window.open)
window.addEventListener('message', async (e) => {
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

    // If the game was opened in the iframe overlay, remove it now
    try {
      const ov = document.getElementById('gameIframeOverlay');
      if (ov) ov.remove();
    } catch (e) {
      /* ignore */
    }

    // If user logged in (has token), save to DB immediately; otherwise redirect to login
    if (currentUser && localStorage.getItem('token')) {
      await saveScoreForUser(lvl, sc);
      showLeaderboard(lvl);
      if (unlocked)
        showToast(`✨ Score enregistré et niveau débloqué pour ${currentUser.username} (${sc})`, 'info');
      else
        showToast(`⚠️ Score enregistré (${sc}). Score minimum pour débloquer le niveau suivant: ${threshold}`, 'warning');
    } else {
      showToast("⚠️ Vous devez être connecté pour sauvegarder vos scores.", 'warning');
      setTimeout(() => (window.location.href = '/index.html'), 350);
    }
  } catch (err) {
    console.log('Erreur en traitant le message du jeu', err);
  }
});
    window.addEventListener('message', async (e) => {
      try {
        const data = e.data;
        if (!data || data.type !== 'nird-game-score') return;
        const lvl = parseInt(data.level, 10);
        const sc = parseInt(data.score, 10) || 0;
        await handleGameScore(lvl, sc);
      } catch (err) {
        console.log('Erreur en traitant le message du jeu', err);
      }
    });

    // Central handler for game scores (from postMessage or URL redirect)
    async function handleGameScore(lvl, sc) {
      // set pending values
      pendingLevelId = lvl;
      pendingLevelScore = sc;

      const threshold =
        parseInt(levelThresholds[lvl] || levelThresholds[String(lvl)] || 0, 10) || 0;
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

      // If the game was opened in the iframe overlay, remove it now
      try {
        const ov = document.getElementById('gameIframeOverlay');
        if (ov) ov.remove();
      } catch (e) {
        /* ignore */
      }

      // If user logged in (has token), save to DB immediately; otherwise redirect to login
      if (currentUser && localStorage.getItem('token')) {
        await saveScoreForUser(lvl, sc);
        showLeaderboard(lvl);
        if (unlocked)
          showToast(`✨ Score enregistré et niveau débloqué pour ${currentUser.username} (${sc})`, 'info');
        else
          showToast(`⚠️ Score enregistré (${sc}). Score minimum pour débloquer le niveau suivant: ${threshold}`, 'warning');
      } else {
        showToast("⚠️ Vous devez être connecté pour sauvegarder vos scores.", 'warning');
        setTimeout(() => (window.location.href = '/index.html'), 350);
      }
    }

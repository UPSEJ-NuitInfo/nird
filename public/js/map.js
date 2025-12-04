// ===================================
// NIRD Academy - Candy Map Logic
// ===================================

// Configuration des niveaux
const levels = [
    {
        id: 1,
        name: "Dino Google",
        description: "Esquivez les obstacles et progressez dans le jeu du dinosaure",
        icon: "🦖"
    },
    {
        id: 2,
        name: "Snake",
        description: "Guidez le serpent sans qu'il se heurte",
        icon: "🐍"
    },
    {
        id: 3,
        name: "Pokémon",
        description: "Attrapez tous les Pokémons de cette région",
        icon: "⚡"
    },
    {
        id: 4,
        name: "Flappy Bird",
        description: "Naviguez entre les tuyaux avec grâce",
        icon: "🐦"
    },
    {
        id: 5,
        name: "Tetris",
        description: "Arrangez les blocs pour compléter les lignes",
        icon: "🧱"
    },
    {
        id: 6,
        name: "Platformer",
        description: "Sautez d'une plateforme à l'autre",
        icon: "🎮"
    }
];

// État du jeu
let gameState = {
    currentLevel: 1,
    completedLevels: [],
    xp: 0
};

let currentUser = null;
let leaderboardData = [];
let pendingLevelScore = 0; // score achieved on last completed level
let pendingLevelId = null; // level id just completed

// Positions des niveaux (adaptées à la map)
const levelPositions = [
    { x: 50, y: 480 },
    { x: 180, y: 360 },
    { x: 310, y: 420 },
    { x: 440, y: 280 },
    { x: 570, y: 380 },
    { x: 700, y: 300 }
];

// ===== INITIALISATION =====
function init() {
    loadGameState();
    initMap();
    updateLevelInfo();
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
            mapContainer
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
    player.style.left = (currentPos.x + 7.5) + 'px';
    player.style.top = (currentPos.y + 7.5) + 'px';
    
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
    if (levelId > gameState.currentLevel && !gameState.completedLevels.includes(levelId - 1)) {
        alert('🔒 Vous devez d\'abord compléter le niveau précédent!');
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
    document.getElementById('completedCount').textContent = gameState.completedLevels.length + '/' + levels.length;
    document.getElementById('xpCount').textContent = gameState.xp;
}

// ===== JOUER UN NIVEAU =====
function playLevel() {
    const levelId = gameState.currentLevel;
    const level = levels[levelId - 1];

    alert(`🎮 Niveau ${levelId}: ${level.name}\n\nLe contenu du jeu sera intégré ici...`);

    // Compléter le niveau
    if (!gameState.completedLevels.includes(levelId)) {
        gameState.completedLevels.push(levelId);
        // simulate a level score (replace with real game score when available)
        const levelScore = 100 * levelId + Math.floor(Math.random() * 100); // placeholder score
        pendingLevelScore = levelScore;
        pendingLevelId = levelId;
        // accumulate overall xp as before
        gameState.xp += levelScore;

        // Avancer au prochain niveau
        if (levelId < levels.length) {
            gameState.currentLevel = levelId + 1;
        }

        saveGameState();
        initMap();
        updateLevelInfo();

        // If the user is already logged in, save score immediately for the completed level
        setTimeout(() => {
            if (currentUser) {
                // update stored user xp then automatically save score for existing user
                currentUser.xp = gameState.xp;
                localStorage.setItem('nirdUser', JSON.stringify(currentUser));
                saveScoreForUser(currentUser, pendingLevelId, pendingLevelScore);
                showLeaderboard(pendingLevelId);
                alert(`✨ Score enregistré pour ${currentUser.username} (${pendingLevelScore})`);
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
            xp: 0
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
    const levelScore = parseInt(levelScoreInput && levelScoreInput.value) || pendingLevelScore || 0;

    // Capture the completed level ID BEFORE anything else
    const completedLevelId = levelId;

    // Créer l'objet utilisateur
    currentUser = {
        username,
        email,
        school,
        xp: gameState.xp,
        completedLevels: gameState.completedLevels.length,
        level: levelId,
        score: levelScore,
        timestamp: new Date().toISOString()
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentUser)
        }).catch(err => console.log('BDD non disponible, mode local'));
    } catch (err) {
        console.log('Score sauvegardé localement');
    }

    closeAuthModal();
    // Use the captured completedLevelId (not pendingLevelId which is now cleared)
    showLeaderboard(completedLevelId);
    alert(`✨ Bravo ${username}!\nVotre score a été enregistré pour le niveau ${completedLevelId}!`);
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
    leaderboardData = (remoteData && remoteData.length) ? remoteData : local;

    // Ajouter l'utilisateur actuel s'il existe et n'est pas déjà présent
    if (currentUser && currentUser.level === levelId && !leaderboardData.find(u => u.email === currentUser.email)) {
        leaderboardData.push(currentUser);
    }

    // Trier par score décroissant (fallback to xp if no score)
    leaderboardData.sort((a, b) => (b.score || b.xp || 0) - (a.score || a.xp || 0));

    // Sauvegarder localement
    localStorage.setItem(key, JSON.stringify(leaderboardData));

    // Afficher le leaderboard
    displayLeaderboard(levelId);
    document.getElementById('leaderboardModal').classList.remove('hidden');
}

function displayLeaderboard(levelId) {
    const content = document.getElementById('leaderboardContent');
    const level = levels.find(l => l.id === levelId) || { name: `Niveau ${levelId}` };

    let html = `<div style="margin-bottom:12px;font-weight:800;color:var(--primary);">Leaderboard — ${level.icon} ${level.name}</div>`;
    html += '<div class="leaderboard-header">';
    html += '<div>Rang</div>';
    html += '<div>Pseudo</div>';
    html += '<div>École</div>';
    html += '<div>Score</div>';
    html += '</div>';

    if (!leaderboardData || leaderboardData.length === 0) {
        html += '<div style="padding:16px;text-align:center;color:var(--neutral);">Aucun score pour ce niveau — soyez le premier !</div>';
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
            const displayScore = (user.score != null) ? `${user.score}` : `${user.xp} XP`;
            html += `<div class="leaderboard-xp">${displayScore}</div>`;
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

    let entry = local.find(u => u.email === user.email);
    if (!entry) {
        entry = {
            username: user.username,
            email: user.email,
            school: user.school || '',
            score: levelScore,
            xp: user.xp || 0,
            timestamp: now,
            level: levelId
        };
        local.push(entry);
    } else {
        // update only if new score is better
        if ((levelScore || 0) > (entry.score || 0)) {
            entry.score = levelScore;
            entry.xp = user.xp || entry.xp;
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
            body: JSON.stringify({ username: entry.username, email: entry.email, school: entry.school, score: entry.score, level: levelId })
        }).catch(() => {/* ignore */});
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
            <p><strong>XP:</strong> <strong style="color:var(--primary);">${currentUser.xp || 0}</strong></p>
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
            <p><strong>XP total:</strong> ${currentUser.xp || 0}</p>
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
        alert('Connectez-vous d\'abord');
        return;
    }

    // Collect all scores from all levels
    const allScores = [];
    for (let levelId = 1; levelId <= levels.length; levelId++) {
        const key = `leaderboardData_level_${levelId}`;
        const local = JSON.parse(localStorage.getItem(key) || '[]');
        const myEntry = local.find(u => u.email === currentUser.email);
        if (myEntry) {
            allScores.push({
                level: levelId,
                levelName: levels[levelId - 1]?.name || `Niveau ${levelId}`,
                levelIcon: levels[levelId - 1]?.icon || '🎮',
                score: myEntry.score || 0,
                rank: local.indexOf(myEntry) + 1
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
        html += '<div style="padding:16px;text-align:center;color:var(--neutral);">Aucun score enregistré.</div>';
    } else {
        allScores.forEach(s => {
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
    if (!confirm('Supprimer toutes les données locales (profil, progression, leaderboards) ?')) return;
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

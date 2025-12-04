// Check authentication
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token) {
  window.location.href = '/';
}

// Display username
document.getElementById('username').textContent =
  user.username || 'Utilisateur';

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
});

// Fetch games
async function loadGames() {
  const loadingEl = document.getElementById('loading');
  const gamesGridEl = document.getElementById('games-grid');
  const emptyStateEl = document.getElementById('empty-state');

  try {
    const response = await fetch('/api/games', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors du chargement des jeux');
    }

    const data = await response.json();
    const games = data.games || [];

    loadingEl.style.display = 'none';

    if (games.length === 0) {
      emptyStateEl.style.display = 'block';
      return;
    }

    // Fetch user scores
    const scoresResponse = await fetch('/api/users/me/scores', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const scoresData = await scoresResponse.json();
    const userScores = {};
    (scoresData.scores || []).forEach((score) => {
      userScores[score.gameId] = score.score;
    });

    // Display games
    gamesGridEl.style.display = 'grid';
    gamesGridEl.innerHTML = games
      .map((game) => {
        const myScore = userScores[game.id] || 0;
        return `
        <div class="game-card" data-game-id="${game.id}">
          <div class="game-icon">🎮</div>
          <h3 class="game-title">${game.name}</h3>
          <p class="game-description">Cliquez pour jouer et améliorer votre score !</p>
          <div class="game-stats">
            <div class="stat">
              <span class="stat-label">Votre score</span>
              <span class="stat-value">${myScore}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Classement</span>
              <span class="stat-value">-</span>
            </div>
          </div>
        </div>
      `;
      })
      .join('');

    // Add click handlers
    document.querySelectorAll('.game-card').forEach((card) => {
      card.addEventListener('click', () => {
        const gameId = card.dataset.gameId;
        window.location.href = `/game.html?id=${gameId}`;
      });
    });
  } catch (error) {
    loadingEl.textContent = 'Erreur lors du chargement des jeux';
    console.error(error);
  }
}

// Load games on page load
loadGames();

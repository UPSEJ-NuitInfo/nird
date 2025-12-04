// App.js - Main learning path page
let currentUser = null;
let lessons = [];

// Initialize app
async function initApp() {
  if (!checkAuth()) return;

  try {
    showLoading();

    // Get user data
    const userData = await API.getUserProfile();
    currentUser = userData.user;
    updateCurrentUser(currentUser);

    // Update header
    updateHeader();

    // Update streak
    await API.updateStreak().catch((err) =>
      console.log('Streak already updated'),
    );

    // Load lessons
    await loadLessons();

    hideLoading();
  } catch (error) {
    console.error('Init error:', error);
    showToast('Erreur lors du chargement', 'error');
    hideLoading();
  }
}

// Update header with user info
function updateHeader() {
  document.getElementById('userXP').textContent = formatNumber(
    currentUser.totalXP,
  );

  const streakBadge = document.getElementById('streakBadge');
  if (currentUser.currentStreak > 0) {
    streakBadge.style.display = 'flex';
    document.getElementById('userStreak').textContent =
      currentUser.currentStreak;
  }

  // Update user menu
  document.getElementById('menuUsername').textContent =
    currentUser.displayName || currentUser.username;
  document.getElementById('menuXP').textContent = `${formatNumber(
    currentUser.totalXP,
  )} XP`;

  if (currentUser.avatar) {
    document.getElementById('userAvatar').src = currentUser.avatar;
    document.getElementById('menuAvatar').src = currentUser.avatar;
  }
}

// Load lessons
async function loadLessons() {
  try {
    const data = await API.getLessons();
    lessons = data.lessons;
    renderLearningPath();
  } catch (error) {
    console.error('Error loading lessons:', error);
    showToast('Erreur lors du chargement des leçons', 'error');
  }
}

// Render learning path (Duolingo style)
function renderLearningPath() {
  const pathContainer = document.getElementById('learningPath');
  pathContainer.innerHTML = '';

  lessons.forEach((lesson, index) => {
    const node = createLessonNode(lesson, index);
    pathContainer.appendChild(node);
  });
}

// Create lesson node
function createLessonNode(lesson, index) {
  const node = document.createElement('div');
  node.className = 'lesson-node';
  node.style.animationDelay = `${index * 0.1}s`;

  const progress = lesson.userProgress || {};
  const isCompleted = progress.isCompleted || false;
  const isLocked = currentUser.totalXP < lesson.requiredXP;
  const stars = progress.stars || 0;

  let cardClass = 'lesson-card';
  if (isCompleted) cardClass += ' completed';
  if (isLocked) cardClass += ' locked';

  node.innerHTML = `
    <div class="${cardClass}" onclick="${
    isLocked ? '' : `openLesson(${lesson.id})`
  }">
      <div class="lesson-header">
        <div class="lesson-number">${lesson.levelNumber}</div>
        <div class="lesson-stars">
          ${Array(3)
            .fill(0)
            .map(
              (_, i) => `
            <i class="fas fa-star star ${i < stars ? '' : 'empty'}"></i>
          `,
            )
            .join('')}
        </div>
      </div>
      
      <h3 class="lesson-title">${lesson.title}</h3>
      <p class="lesson-description">${lesson.description}</p>
      
      ${
        !isLocked
          ? `
        <div class="lesson-progress">
          <div class="lesson-progress-bar" style="width: ${
            isCompleted ? 100 : progress.score || 0
          }%"></div>
        </div>
        
        <div class="lesson-stats">
          <span>${lesson.exercises?.length || 0} exercices</span>
          <span class="lesson-xp">+${calculateLessonXP(lesson)} XP</span>
        </div>
      `
          : `
        <div class="lock-reason">
          <i class="fas fa-lock"></i>
          <span>Nécessite ${formatNumber(
            lesson.requiredXP,
          )} XP (tu as ${formatNumber(currentUser.totalXP)} XP)</span>
        </div>
      `
      }
    </div>
  `;

  return node;
}

// Calculate total XP for lesson
function calculateLessonXP(lesson) {
  if (!lesson.exercises) return 0;
  return lesson.exercises.reduce((sum, ex) => sum + (ex.xpReward || 0), 0);
}

// Open lesson
function openLesson(lessonId) {
  window.location.href = `/lesson.html?id=${lessonId}`;
}

// Toggle user menu
function toggleUserMenu() {
  const menu = document.getElementById('userMenu');
  menu.classList.toggle('hidden');
}

// Close user menu when clicking outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('userMenu');
  const avatar = document.getElementById('userAvatar');

  if (menu && !menu.contains(e.target) && e.target !== avatar) {
    menu.classList.add('hidden');
  }
});

// Show/hide loading
function showLoading() {
  document.getElementById('loadingOverlay')?.classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('loadingOverlay')?.classList.add('hidden');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initApp);

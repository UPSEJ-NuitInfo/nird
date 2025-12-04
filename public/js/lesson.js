// Lesson.js - Exercise player
let lessonId = null;
let lesson = null;
let exercises = [];
let currentExerciseIndex = 0;
let sessionXP = 0;
let correctAnswers = 0;
let startTime = Date.now();

// Game state
let selectedAnswer = null;
let matchingPairs = [];
let matchedCount = 0;

// Initialize lesson
async function initLesson() {
  if (!checkAuth()) return;

  // Get lesson ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  lessonId = urlParams.get('id');

  if (!lessonId) {
    showToast('Leçon introuvable', 'error');
    setTimeout(() => (window.location.href = '/app.html'), 1500);
    return;
  }

  try {
    // Load lesson data
    const data = await API.getLesson(lessonId);
    lesson = data.lesson;
    exercises = lesson.exercises || [];

    if (exercises.length === 0) {
      showToast("Cette leçon n'a pas encore d'exercices", 'error');
      setTimeout(() => (window.location.href = '/app.html'), 1500);
      return;
    }

    // Start lesson
    await API.startLesson(lessonId);

    // Load first exercise
    loadExercise();
    updateProgress();
  } catch (error) {
    console.error('Error loading lesson:', error);
    showToast('Erreur lors du chargement de la leçon', 'error');
  }
}

// Load current exercise
function loadExercise() {
  if (currentExerciseIndex >= exercises.length) {
    completeLesson();
    return;
  }

  const exercise = exercises[currentExerciseIndex];
  const container = document.getElementById('exerciseContainer');

  startTime = Date.now();
  selectedAnswer = null;
  matchingPairs = [];
  matchedCount = 0;

  // Render based on game type
  switch (exercise.gameType.code) {
    case 'quiz':
      renderQuizExercise(exercise, container);
      break;
    case 'matching':
      renderMatchingExercise(exercise, container);
      break;
    case 'typing':
      renderTypingExercise(exercise, container);
      break;
    default:
      container.innerHTML = `<div class="exercise-card"><p>Type de jeu non supporté: ${exercise.gameType.code}</p></div>`;
  }

  updateProgress();
}

// Render Quiz Exercise
function renderQuizExercise(exercise, container) {
  const isTrueFalse = exercise.data.type === 'true-false';
  const options = isTrueFalse ? ['Vrai', 'Faux'] : exercise.data.options;

  container.innerHTML = `
    <div class="exercise-card">
      <h2 class="exercise-question">${exercise.question}</h2>
      
      <div class="quiz-options">
        ${options
          .map(
            (option, index) => `
          <div class="quiz-option" onclick="selectQuizOption(${index}, ${isTrueFalse})">
            ${option}
          </div>
        `,
          )
          .join('')}
      </div>
      
      <div class="submit-section">
        <button class="btn btn-primary submit-btn" onclick="submitQuizAnswer()" disabled id="submitBtn">
          Vérifier
        </button>
      </div>
    </div>
  `;
}

// Select quiz option
function selectQuizOption(index, isTrueFalse) {
  document
    .querySelectorAll('.quiz-option')
    .forEach((opt) => opt.classList.remove('selected'));
  event.target.classList.add('selected');

  selectedAnswer = isTrueFalse ? index === 0 : index;
  document.getElementById('submitBtn').disabled = false;
}

// Submit quiz answer
async function submitQuizAnswer() {
  if (selectedAnswer === null) return;

  const exercise = exercises[currentExerciseIndex];
  const timeSpent = Math.floor((Date.now() - startTime) / 1000);

  try {
    const result = await API.submitAnswer(
      exercise.id,
      selectedAnswer,
      timeSpent,
    );

    if (result.isCorrect) {
      correctAnswers++;
      sessionXP += result.xpEarned;
      document.getElementById('sessionXP').textContent = sessionXP;
    }

    showFeedback(result);
  } catch (error) {
    showToast('Erreur lors de la soumission', 'error');
  }
}

// Render Matching Exercise
function renderMatchingExercise(exercise, container) {
  const pairs = exercise.data.pairs;
  const leftItems = pairs.map((p) => p.left);
  const rightItems = [...pairs.map((p) => p.right)].sort(
    () => Math.random() - 0.5,
  );

  container.innerHTML = `
    <div class="exercise-card">
      <h2 class="exercise-question">${exercise.question}</h2>
      
      <div class="matching-game">
        <div class="matching-column" id="leftColumn">
          ${leftItems
            .map(
              (item, i) => `
            <div class="matching-item" data-index="${i}" data-value="${item}" onclick="selectMatchingItem('left', ${i})">
              ${item}
            </div>
          `,
            )
            .join('')}
        </div>
        
        <div class="matching-column" id="rightColumn">
          ${rightItems
            .map(
              (item, i) => `
            <div class="matching-item" data-index="${i}" data-value="${item}" onclick="selectMatchingItem('right', ${i})">
              ${item}
            </div>
          `,
            )
            .join('')}
        </div>
      </div>
      
      <div class="submit-section">
        <button class="btn btn-primary submit-btn" onclick="submitMatchingAnswer()" disabled id="submitBtn">
          Vérifier (${matchedCount}/${pairs.length})
        </button>
      </div>
    </div>
  `;
}

// Select matching item
let matchingSelection = { left: null, right: null };

function selectMatchingItem(side, index) {
  const item = event.target;

  if (item.classList.contains('matched')) return;

  // Deselect previous
  document
    .querySelectorAll(`#${side}Column .matching-item`)
    .forEach((i) => i.classList.remove('selected'));

  item.classList.add('selected');
  matchingSelection[side] = { index, value: item.dataset.value, element: item };

  // If both selected, check match
  if (matchingSelection.left && matchingSelection.right) {
    checkMatch();
  }
}

function checkMatch() {
  const { left, right } = matchingSelection;
  const exercise = exercises[currentExerciseIndex];
  const pairs = exercise.data.pairs;

  const isMatch = pairs.some(
    (p) => p.left === left.value && p.right === right.value,
  );

  if (isMatch) {
    left.element.classList.add('matched');
    right.element.classList.add('matched');
    left.element.classList.remove('selected');
    right.element.classList.remove('selected');

    matchingPairs.push({ left: left.value, right: right.value });
    matchedCount++;

    document.querySelector(
      '.submit-btn',
    ).textContent = `Vérifier (${matchedCount}/${pairs.length})`;

    if (matchedCount === pairs.length) {
      document.getElementById('submitBtn').disabled = false;
    }
  } else {
    setTimeout(() => {
      left.element.classList.remove('selected');
      right.element.classList.remove('selected');
    }, 500);
  }

  matchingSelection = { left: null, right: null };
}

async function submitMatchingAnswer() {
  const exercise = exercises[currentExerciseIndex];
  const timeSpent = Math.floor((Date.now() - startTime) / 1000);

  try {
    const result = await API.submitAnswer(
      exercise.id,
      matchingPairs,
      timeSpent,
    );

    if (result.isCorrect) {
      correctAnswers++;
      sessionXP += result.xpEarned;
      document.getElementById('sessionXP').textContent = sessionXP;
    }

    showFeedback(result);
  } catch (error) {
    showToast('Erreur lors de la soumission', 'error');
  }
}

// Render Typing Exercise
function renderTypingExercise(exercise, container) {
  container.innerHTML = `
    <div class="exercise-card">
      <h2 class="exercise-question">${exercise.question}</h2>
      
      <div class="typing-game">
        <input 
          type="text" 
          class="typing-input" 
          id="typingInput" 
          placeholder="Tape ta réponse ici..."
          autocomplete="off"
          spellcheck="false"
        >
        
        ${
          exercise.data.hints
            ? `
          <div class="typing-hints">
            <h4>💡 Indices</h4>
            <ul>
              ${exercise.data.hints.map((hint) => `<li>${hint}</li>`).join('')}
            </ul>
          </div>
        `
            : ''
        }
      </div>
      
      <div class="submit-section">
        <button class="btn btn-primary submit-btn" onclick="submitTypingAnswer()" id="submitBtn">
          Vérifier
        </button>
      </div>
    </div>
  `;

  // Auto-focus input
  document.getElementById('typingInput').focus();

  // Submit on Enter
  document.getElementById('typingInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitTypingAnswer();
    }
  });
}

async function submitTypingAnswer() {
  const input = document.getElementById('typingInput');
  const answer = input.value.trim();

  if (!answer) {
    showToast('Entre une réponse', 'warning');
    return;
  }

  const exercise = exercises[currentExerciseIndex];
  const timeSpent = Math.floor((Date.now() - startTime) / 1000);

  try {
    const result = await API.submitAnswer(exercise.id, answer, timeSpent);

    if (result.isCorrect) {
      correctAnswers++;
      sessionXP += result.xpEarned;
      document.getElementById('sessionXP').textContent = sessionXP;
    }

    showFeedback(result);
  } catch (error) {
    showToast('Erreur lors de la soumission', 'error');
  }
}

// Show feedback
function showFeedback(result) {
  const modal = document.getElementById('feedbackModal');
  const icon = document.getElementById('feedbackIcon');
  const title = document.getElementById('feedbackTitle');
  const message = document.getElementById('feedbackMessage');
  const xp = document.getElementById('feedbackXP');

  if (result.isCorrect) {
    modal.classList.remove('error');
    icon.textContent = '✅';
    title.textContent = 'Bravo !';
    message.textContent = result.feedback;
    xp.innerHTML = `<i class="fas fa-star"></i> +${result.xpEarned} XP`;
  } else {
    modal.classList.add('error');
    icon.textContent = '❌';
    title.textContent = 'Pas tout à fait...';
    message.textContent = result.feedback;
    xp.textContent = '';
  }

  modal.classList.remove('hidden');
}

// Next exercise
function nextExercise() {
  document.getElementById('feedbackModal').classList.add('hidden');
  currentExerciseIndex++;
  loadExercise();
}

// Update progress bar
function updateProgress() {
  const progress = ((currentExerciseIndex + 1) / exercises.length) * 100;
  document.getElementById('lessonProgress').style.width = `${progress}%`;
  document.getElementById('progressText').textContent = `${
    currentExerciseIndex + 1
  }/${exercises.length}`;
}

// Complete lesson
async function completeLesson() {
  const score = Math.round((correctAnswers / exercises.length) * 100);
  const stars = score >= 90 ? 3 : score >= 70 ? 2 : score >= 50 ? 1 : 0;

  try {
    await API.completeLesson(lessonId, score, stars);
    showCompletionModal(score, stars);
  } catch (error) {
    console.error('Error completing lesson:', error);
    showToast('Erreur lors de la validation', 'error');
  }
}

// Show completion modal
function showCompletionModal(score, stars) {
  document.getElementById('finalScore').textContent = `${score}%`;
  document.getElementById('finalXP').textContent = `${sessionXP} XP`;
  document.getElementById('finalStars').textContent = '⭐'.repeat(stars);
  document.getElementById('completionModal').classList.remove('hidden');
}

// Exit lesson
function exitLesson() {
  if (confirm('Es-tu sûr de vouloir quitter ? Ta progression sera perdue.')) {
    window.location.href = '/app.html';
  }
}

// Retry lesson
function retryLesson() {
  window.location.reload();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initLesson);

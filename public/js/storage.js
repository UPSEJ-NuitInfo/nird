/**
 * NIRD Storage - Gestion du localStorage
 * Module pour gérer la sauvegarde des données utilisateur
 */

const STORAGE_KEYS = {
  NAVIGATOR_DATA: 'nird_navigator_data',
  ACADEMY_PROGRESS: 'nird_academy_progress',
  USER_BADGES: 'nird_user_badges',
  QUIZ_RESULTS: 'nird_quiz_results',
  USER_PROFILE: 'nird_user_profile',
};

/**
 * Sauvegarder les données du Navigator
 */
function saveNavigatorData(data) {
  return NIRD.saveToStorage(STORAGE_KEYS.NAVIGATOR_DATA, {
    ...data,
    timestamp: Date.now(),
  });
}

/**
 * Récupérer les données du Navigator
 */
function getNavigatorData() {
  return NIRD.getFromStorage(STORAGE_KEYS.NAVIGATOR_DATA);
}

/**
 * Sauvegarder la progression de l'Académie
 */
function saveAcademyProgress(levelId, completed = false, score = 0) {
  const progress = NIRD.getFromStorage(STORAGE_KEYS.ACADEMY_PROGRESS) || {};

  progress[levelId] = {
    completed,
    score,
    timestamp: Date.now(),
  };

  return NIRD.saveToStorage(STORAGE_KEYS.ACADEMY_PROGRESS, progress);
}

/**
 * Récupérer la progression de l'Académie
 */
function getAcademyProgress() {
  return NIRD.getFromStorage(STORAGE_KEYS.ACADEMY_PROGRESS) || {};
}

/**
 * Obtenir le nombre de niveaux complétés
 */
function getCompletedLevelsCount() {
  const progress = getAcademyProgress();
  return Object.values(progress).filter((level) => level.completed).length;
}

/**
 * Débloquer un badge
 */
function unlockBadge(badgeId, badgeName, badgeType = 'bronze') {
  const badges = NIRD.getFromStorage(STORAGE_KEYS.USER_BADGES) || [];

  // Vérifier si le badge existe déjà
  if (badges.some((b) => b.id === badgeId)) {
    return false;
  }

  badges.push({
    id: badgeId,
    name: badgeName,
    type: badgeType,
    unlockedAt: Date.now(),
  });

  NIRD.saveToStorage(STORAGE_KEYS.USER_BADGES, badges);

  // Afficher notification
  NIRD.showToast(`🎖️ Badge débloqué : ${badgeName}`, 'success', 5000);

  return true;
}

/**
 * Récupérer tous les badges
 */
function getUserBadges() {
  return NIRD.getFromStorage(STORAGE_KEYS.USER_BADGES) || [];
}

/**
 * Vérifier si un badge est débloqué
 */
function hasBadge(badgeId) {
  const badges = getUserBadges();
  return badges.some((b) => b.id === badgeId);
}

/**
 * Sauvegarder les résultats d'un quiz
 */
function saveQuizResult(levelId, score, maxScore, answers) {
  const results = NIRD.getFromStorage(STORAGE_KEYS.QUIZ_RESULTS) || {};

  results[levelId] = {
    score,
    maxScore,
    percentage: Math.round((score / maxScore) * 100),
    answers,
    timestamp: Date.now(),
  };

  return NIRD.saveToStorage(STORAGE_KEYS.QUIZ_RESULTS, results);
}

/**
 * Récupérer les résultats d'un quiz
 */
function getQuizResult(levelId) {
  const results = NIRD.getFromStorage(STORAGE_KEYS.QUIZ_RESULTS) || {};
  return results[levelId];
}

/**
 * Calculer le score total XP
 */
function getTotalXP() {
  const progress = getAcademyProgress();
  let totalXP = 0;

  Object.values(progress).forEach((level) => {
    if (level.completed) {
      totalXP += level.score || 100; // 100 XP par défaut
    }
  });

  return totalXP;
}

/**
 * Obtenir le niveau de badge basé sur la progression
 */
function getBadgeLevel() {
  const completedLevels = getCompletedLevelsCount();
  const badges = getUserBadges();

  if (completedLevels >= 5 && badges.length >= 3) {
    return { level: 'gold', name: 'Or - Résistant Certifié' };
  } else if (completedLevels >= 3) {
    return { level: 'silver', name: 'Argent - Explorateur' };
  } else if (completedLevels >= 1) {
    return { level: 'bronze', name: 'Bronze - Initié' };
  }

  return { level: 'none', name: 'Aucun badge' };
}

/**
 * Réinitialiser toutes les données (pour debug)
 */
function resetAllData() {
  const confirm = window.confirm(
    '⚠️ Voulez-vous vraiment effacer toutes vos données ?',
  );

  if (confirm) {
    Object.values(STORAGE_KEYS).forEach((key) => {
      NIRD.removeFromStorage(key);
    });

    NIRD.showToast('Données réinitialisées', 'info');
    setTimeout(() => window.location.reload(), 1000);
  }
}

/**
 * Exporter les données utilisateur (pour sauvegarde)
 */
function exportUserData() {
  const data = {
    navigator: getNavigatorData(),
    academy: getAcademyProgress(),
    badges: getUserBadges(),
    quizResults: NIRD.getFromStorage(STORAGE_KEYS.QUIZ_RESULTS),
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nird-backup-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);

  NIRD.showToast('Données exportées', 'success');
}

/**
 * Importer des données utilisateur
 */
function importUserData(file) {
  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);

      if (data.navigator)
        NIRD.saveToStorage(STORAGE_KEYS.NAVIGATOR_DATA, data.navigator);
      if (data.academy)
        NIRD.saveToStorage(STORAGE_KEYS.ACADEMY_PROGRESS, data.academy);
      if (data.badges)
        NIRD.saveToStorage(STORAGE_KEYS.USER_BADGES, data.badges);
      if (data.quizResults)
        NIRD.saveToStorage(STORAGE_KEYS.QUIZ_RESULTS, data.quizResults);

      NIRD.showToast('Données importées avec succès', 'success');
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error('Erreur import:', error);
      NIRD.showToast("Erreur lors de l'import", 'error');
    }
  };

  reader.readAsText(file);
}

// Ajouter au namespace global
window.NIRD.Storage = {
  STORAGE_KEYS,
  saveNavigatorData,
  getNavigatorData,
  saveAcademyProgress,
  getAcademyProgress,
  getCompletedLevelsCount,
  unlockBadge,
  getUserBadges,
  hasBadge,
  saveQuizResult,
  getQuizResult,
  getTotalXP,
  getBadgeLevel,
  resetAllData,
  exportUserData,
  importUserData,
};

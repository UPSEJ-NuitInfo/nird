const express = require('express');
const router = express.Router();
const {
  Exercise,
  ExerciseAttempt,
  User,
  GameType,
} = require('../database/models');
const { authenticateToken } = require('./auth');

// ============================================
// GET /api/exercises/:id - Détails d'un exercice
// ============================================
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id, {
      include: [{ model: GameType, as: 'gameType' }],
    });

    if (!exercise) {
      return res.status(404).json({ error: 'Exercice non trouvé' });
    }

    // Ne pas renvoyer la réponse correcte !
    const exerciseData = exercise.toJSON();

    // Masquer les réponses selon le type de jeu
    if (exerciseData.data) {
      if (exerciseData.data.correct !== undefined) {
        delete exerciseData.data.correct;
      }
      if (exerciseData.data.expectedAnswer) {
        delete exerciseData.data.expectedAnswer;
      }
    }

    res.json({ exercise: exerciseData });
  } catch (error) {
    console.error('Erreur GET exercise:', error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de l'exercice" });
  }
});

// ============================================
// POST /api/exercises/:id/submit - Soumettre une réponse
// ============================================
router.post('/:id/submit', authenticateToken, async (req, res) => {
  try {
    const { answer, timeSpent } = req.body;

    const exercise = await Exercise.findByPk(req.params.id, {
      include: [{ model: GameType, as: 'gameType' }],
    });

    if (!exercise) {
      return res.status(404).json({ error: 'Exercice non trouvé' });
    }

    // Vérifier la réponse selon le type de jeu
    let isCorrect = false;
    let feedback = '';

    switch (exercise.gameType.code) {
      case 'quiz':
        if (exercise.data.type === 'true-false') {
          isCorrect = answer === exercise.data.correct;
        } else if (exercise.data.type === 'multiple-choice') {
          isCorrect = answer === exercise.data.correct;
        }
        feedback = exercise.data.explanation || '';
        break;

      case 'matching':
        // answer doit être un array de paires correctes
        const correctPairs = exercise.data.pairs;
        isCorrect =
          JSON.stringify(answer.sort()) === JSON.stringify(correctPairs.sort());
        feedback = isCorrect
          ? 'Toutes les associations sont correctes !'
          : 'Certaines associations sont incorrectes.';
        break;

      case 'typing':
        const normalized = answer.trim().toLowerCase();
        const expected = exercise.data.expectedAnswer.toLowerCase();
        const variations = exercise.data.acceptedVariations || [];

        isCorrect =
          normalized === expected ||
          variations.some((v) => v.toLowerCase() === normalized);
        feedback = isCorrect
          ? 'Commande correcte !'
          : `La réponse attendue était : ${exercise.data.expectedAnswer}`;
        break;

      case 'estimation':
        // Tolérance de ±20%
        const userValue = parseFloat(answer);
        const correctValue = exercise.data.correctValue;
        const tolerance = correctValue * 0.2;

        isCorrect = Math.abs(userValue - correctValue) <= tolerance;
        feedback = `La valeur correcte était ${correctValue}. Tu as répondu ${userValue}.`;
        break;

      default:
        return res.status(400).json({ error: 'Type de jeu non supporté' });
    }

    // Calculer XP gagné
    let xpEarned = 0;
    if (isCorrect) {
      xpEarned = exercise.xpReward;

      // Bonus vitesse (< 5 secondes)
      if (timeSpent && timeSpent < 5) {
        xpEarned += 5;
      }

      // Bonus première tentative
      const previousAttempts = await ExerciseAttempt.count({
        where: {
          userId: req.user.id,
          exerciseId: exercise.id,
        },
      });
      if (previousAttempts === 0) {
        xpEarned += 5;
      }
    }

    // Enregistrer tentative
    await ExerciseAttempt.create({
      userId: req.user.id,
      exerciseId: exercise.id,
      isCorrect,
      userAnswer: answer,
      timeSpent: timeSpent || 0,
      xpEarned,
    });

    // Mettre à jour XP utilisateur
    if (xpEarned > 0) {
      const user = await User.findByPk(req.user.id);
      await user.update({
        totalXP: user.totalXP + xpEarned,
      });
    }

    res.json({
      isCorrect,
      xpEarned,
      feedback,
      correctAnswer: isCorrect
        ? null
        : exercise.data.correct || exercise.data.expectedAnswer,
    });
  } catch (error) {
    console.error('Erreur submit exercise:', error);
    res
      .status(500)
      .json({ error: 'Erreur lors de la soumission de la réponse' });
  }
});

// ============================================
// GET /api/exercises/:id/stats - Statistiques exercice
// ============================================
router.get('/:id/stats', authenticateToken, async (req, res) => {
  try {
    const attempts = await ExerciseAttempt.findAll({
      where: {
        userId: req.user.id,
        exerciseId: req.params.id,
      },
      order: [['createdAt', 'DESC']],
    });

    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter((a) => a.isCorrect).length;
    const successRate =
      totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
    const totalXP = attempts.reduce((sum, a) => sum + a.xpEarned, 0);

    res.json({
      totalAttempts,
      correctAttempts,
      successRate: Math.round(successRate),
      totalXP,
      lastAttempt: attempts[0] || null,
    });
  } catch (error) {
    console.error('Erreur stats exercise:', error);
    res
      .status(500)
      .json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

module.exports = router;

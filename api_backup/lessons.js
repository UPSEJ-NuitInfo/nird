const express = require('express');
const router = express.Router();
const {
  Lesson,
  Exercise,
  GameType,
  UserProgress,
  User,
} = require('../database/models');
const { authenticateToken, optionalAuth } = require('./auth');

// ============================================
// GET /api/lessons - Liste toutes les leçons
// ============================================
router.get('/', optionalAuth, async (req, res) => {
  try {
    const lessons = await Lesson.findAll({
      order: [['orderIndex', 'ASC']],
      include: [
        {
          model: Exercise,
          as: 'exercises',
          include: [{ model: GameType, as: 'gameType' }],
        },
      ],
    });

    // Si utilisateur connecté, ajouter sa progression
    if (req.user) {
      const progress = await UserProgress.findAll({
        where: { userId: req.user.id },
      });

      const progressMap = progress.reduce((acc, p) => {
        acc[p.lessonId] = {
          isCompleted: p.isCompleted,
          score: p.score,
          stars: p.stars,
        };
        return acc;
      }, {});

      const lessonsWithProgress = lessons.map((lesson) => {
        const lessonData = lesson.toJSON();
        lessonData.userProgress = progressMap[lesson.id] || null;
        return lessonData;
      });

      return res.json({ lessons: lessonsWithProgress });
    }

    res.json({ lessons });
  } catch (error) {
    console.error('Erreur GET lessons:', error);
    res
      .status(500)
      .json({ error: 'Erreur lors de la récupération des leçons' });
  }
});

// ============================================
// GET /api/lessons/:id - Détails d'une leçon
// ============================================
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id, {
      include: [
        {
          model: Exercise,
          as: 'exercises',
          include: [{ model: GameType, as: 'gameType' }],
          order: [['orderIndex', 'ASC']],
        },
      ],
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Leçon non trouvée' });
    }

    const lessonData = lesson.toJSON();

    // Si connecté, ajouter progression
    if (req.user) {
      const progress = await UserProgress.findOne({
        where: {
          userId: req.user.id,
          lessonId: lesson.id,
        },
      });

      lessonData.userProgress = progress
        ? {
            isCompleted: progress.isCompleted,
            score: progress.score,
            stars: progress.stars,
            completedAt: progress.completedAt,
          }
        : null;
    }

    res.json({ lesson: lessonData });
  } catch (error) {
    console.error('Erreur GET lesson:', error);
    res
      .status(500)
      .json({ error: 'Erreur lors de la récupération de la leçon' });
  }
});

// ============================================
// POST /api/lessons/:id/start - Démarrer une leçon
// ============================================
router.post('/:id/start', authenticateToken, async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id);

    if (!lesson) {
      return res.status(404).json({ error: 'Leçon non trouvée' });
    }

    // Vérifier XP requis
    const user = await User.findByPk(req.user.id);
    if (user.totalXP < lesson.requiredXP) {
      return res.status(403).json({
        error: 'XP insuffisant',
        required: lesson.requiredXP,
        current: user.totalXP,
      });
    }

    // Créer ou récupérer progression
    const [progress, created] = await UserProgress.findOrCreate({
      where: {
        userId: req.user.id,
        lessonId: lesson.id,
      },
      defaults: {
        isCompleted: false,
        score: 0,
        stars: 0,
      },
    });

    res.json({
      message: created ? 'Leçon démarrée' : 'Leçon en cours',
      progress: {
        lessonId: progress.lessonId,
        isCompleted: progress.isCompleted,
        score: progress.score,
        stars: progress.stars,
      },
    });
  } catch (error) {
    console.error('Erreur start lesson:', error);
    res.status(500).json({ error: 'Erreur lors du démarrage de la leçon' });
  }
});

// ============================================
// POST /api/lessons/:id/complete - Terminer une leçon
// ============================================
router.post('/:id/complete', authenticateToken, async (req, res) => {
  try {
    const { score, stars } = req.body;

    const progress = await UserProgress.findOne({
      where: {
        userId: req.user.id,
        lessonId: req.params.id,
      },
    });

    if (!progress) {
      return res.status(404).json({ error: 'Progression non trouvée' });
    }

    // Mettre à jour progression
    await progress.update({
      isCompleted: true,
      completedAt: new Date(),
      score: Math.max(progress.score, score || 0),
      stars: Math.max(progress.stars, stars || 0),
    });

    res.json({
      message: 'Leçon terminée !',
      progress: {
        lessonId: progress.lessonId,
        isCompleted: true,
        score: progress.score,
        stars: progress.stars,
        completedAt: progress.completedAt,
      },
    });
  } catch (error) {
    console.error('Erreur complete lesson:', error);
    res.status(500).json({ error: 'Erreur lors de la validation de la leçon' });
  }
});

module.exports = router;

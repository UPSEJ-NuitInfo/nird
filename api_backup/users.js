const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const {
  User,
  UserProgress,
  UserAchievement,
  Achievement,
  ExerciseAttempt,
  Lesson,
} = require('../database/models');
const { authenticateToken } = require('./auth');

// ============================================
// GET /api/users/profile - Profil complet
// ============================================
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        'id',
        'username',
        'displayName',
        'avatar',
        'email',
        'totalXP',
        'currentStreak',
        'longestStreak',
        'lastActiveDate',
        'isAnonymous',
        'createdAt',
      ],
      include: [
        {
          model: UserProgress,
          as: 'progress',
          include: [{ model: Lesson }],
        },
        {
          model: UserAchievement,
          as: 'achievements',
          include: [{ model: Achievement, as: 'achievement' }],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Calculer statistiques
    const totalLessons = await Lesson.count();
    const completedLessons = user.progress.filter((p) => p.isCompleted).length;
    const totalStars = user.progress.reduce((sum, p) => sum + p.stars, 0);

    const totalAttempts = await ExerciseAttempt.count({
      where: { userId: user.id },
    });

    const correctAttempts = await ExerciseAttempt.count({
      where: { userId: user.id, isCorrect: true },
    });

    res.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        email: user.email,
        totalXP: user.totalXP,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        lastActiveDate: user.lastActiveDate,
        isAnonymous: user.isAnonymous,
        memberSince: user.createdAt,
      },
      stats: {
        completedLessons,
        totalLessons,
        totalStars,
        totalAttempts,
        correctAttempts,
        successRate:
          totalAttempts > 0
            ? Math.round((correctAttempts / totalAttempts) * 100)
            : 0,
      },
      achievements: user.achievements.map((ua) => ({
        ...ua.achievement.toJSON(),
        unlockedAt: ua.unlockedAt,
      })),
    });
  } catch (error) {
    console.error('Erreur profile:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
  }
});

// ============================================
// POST /api/users/update-streak - Mettre à jour série
// ============================================
router.post('/update-streak', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const today = new Date().toISOString().split('T')[0];

    // Si déjà actif aujourd'hui, ne rien faire
    if (user.lastActiveDate === today) {
      return res.json({
        message: "Série déjà mise à jour aujourd'hui",
        currentStreak: user.currentStreak,
      });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = user.currentStreak;

    if (user.lastActiveDate === yesterdayStr) {
      // Continuer la série
      newStreak += 1;
    } else if (user.lastActiveDate < yesterdayStr) {
      // Série cassée
      newStreak = 1;
    }

    await user.update({
      currentStreak: newStreak,
      longestStreak: Math.max(user.longestStreak, newStreak),
      lastActiveDate: today,
    });

    // Vérifier succès streak
    await checkStreakAchievements(user);

    res.json({
      message: 'Série mise à jour',
      currentStreak: newStreak,
      longestStreak: user.longestStreak,
      isNewRecord: newStreak > user.longestStreak,
    });
  } catch (error) {
    console.error('Erreur update-streak:', error);
    res
      .status(500)
      .json({ error: 'Erreur lors de la mise à jour de la série' });
  }
});

// ============================================
// GET /api/users/leaderboard - Classement
// ============================================
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const timeframe = req.query.timeframe || 'all-time'; // all-time, month, week

    let whereClause = { isAnonymous: false };

    if (timeframe === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      whereClause.lastActiveDate = { [Op.gte]: monthAgo };
    } else if (timeframe === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      whereClause.lastActiveDate = { [Op.gte]: weekAgo };
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: [
        'id',
        'username',
        'displayName',
        'avatar',
        'totalXP',
        'currentStreak',
        'longestStreak',
      ],
      order: [['totalXP', 'DESC']],
      limit,
    });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      totalXP: user.totalXP,
      currentStreak: user.currentStreak,
    }));

    res.json({ leaderboard, timeframe });
  } catch (error) {
    console.error('Erreur leaderboard:', error);
    res
      .status(500)
      .json({ error: 'Erreur lors de la récupération du classement' });
  }
});

// ============================================
// GET /api/users/:id/public - Profil public
// ============================================
router.get('/:id/public', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: [
        'id',
        'username',
        'displayName',
        'avatar',
        'totalXP',
        'currentStreak',
        'longestStreak',
        'createdAt',
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const completedLessons = await UserProgress.count({
      where: { userId: user.id, isCompleted: true },
    });

    const achievements = await UserAchievement.findAll({
      where: { userId: user.id },
      include: [{ model: Achievement, as: 'achievement' }],
    });

    res.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        totalXP: user.totalXP,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        memberSince: user.createdAt,
      },
      stats: {
        completedLessons,
      },
      achievements: achievements.map((ua) => ({
        ...ua.achievement.toJSON(),
        unlockedAt: ua.unlockedAt,
      })),
    });
  } catch (error) {
    console.error('Erreur public profile:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
  }
});

// ============================================
// Fonction helper - Vérifier succès streak
// ============================================
async function checkStreakAchievements(user) {
  const streakAchievements = await Achievement.findAll({
    where: {
      requirement: {
        type: 'streak',
      },
    },
  });

  for (const achievement of streakAchievements) {
    const requiredStreak = achievement.requirement.value;

    if (user.currentStreak >= requiredStreak) {
      // Vérifier si déjà obtenu
      const existing = await UserAchievement.findOne({
        where: {
          userId: user.id,
          achievementId: achievement.id,
        },
      });

      if (!existing) {
        await UserAchievement.create({
          userId: user.id,
          achievementId: achievement.id,
        });

        // Bonus XP
        if (achievement.xpBonus > 0) {
          await user.increment('totalXP', { by: achievement.xpBonus });
        }
      }
    }
  }
}

module.exports = router;

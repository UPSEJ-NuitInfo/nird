const express = require('express');
const router = express.Router();
const { Highscore, Game, User } = require('../database/models');
const { authenticateToken } = require('./auth_new');

// ============================================
// GET /api/users/:id/scores - Tous les scores d'un utilisateur
// ============================================
router.get('/:id/scores', async (req, res) => {
  try {
    const userId = req.params.id;

    // Vérifier que l'utilisateur existe
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const scores = await Highscore.findAll({
      where: { id_user: userId },
      include: [
        {
          model: Game,
          as: 'game',
          attributes: ['id', 'name'],
        },
      ],
      order: [['updatedAt', 'DESC']],
    });

    const formattedScores = scores.map((entry) => ({
      gameId: entry.game.id,
      gameName: entry.game.name,
      score: entry.score,
      updatedAt: entry.updatedAt,
    }));

    res.json({
      username: user.username,
      scores: formattedScores,
    });
  } catch (error) {
    console.error('Erreur user scores:', error);
    res
      .status(500)
      .json({ error: 'Erreur lors de la récupération des scores' });
  }
});

// ============================================
// GET /api/users/me/scores - Mes scores (utilisateur connecté)
// ============================================
router.get('/me/scores', authenticateToken, async (req, res) => {
  try {
    const scores = await Highscore.findAll({
      where: { id_user: req.user.id },
      include: [
        {
          model: Game,
          as: 'game',
          attributes: ['id', 'name'],
        },
      ],
      order: [['updatedAt', 'DESC']],
    });

    const formattedScores = scores.map((entry) => ({
      gameId: entry.game.id,
      gameName: entry.game.name,
      score: entry.score,
      updatedAt: entry.updatedAt,
    }));

    res.json({
      username: req.user.username,
      scores: formattedScores,
    });
  } catch (error) {
    console.error('Erreur my scores:', error);
    res
      .status(500)
      .json({ error: 'Erreur lors de la récupération de vos scores' });
  }
});

module.exports = router;

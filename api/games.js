const express = require('express');
const router = express.Router();
const { Game, Highscore, User } = require('../database/models');
const { authenticateToken } = require('./auth_new');

// ============================================
// GET /api/games - Liste tous les jeux
// ============================================
router.get('/', async (req, res) => {
  try {
    const games = await Game.findAll({
      order: [['id', 'ASC']],
    });

    res.json({ games });
  } catch (error) {
    console.error('Erreur GET games:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des jeux' });
  }
});

// ============================================
// GET /api/games/:id - Détails d'un jeu
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);

    if (!game) {
      return res.status(404).json({ error: 'Jeu non trouvé' });
    }

    res.json({ game });
  } catch (error) {
    console.error('Erreur GET game:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du jeu' });
  }
});

// ============================================
// POST /api/games/:id/score - Enregistrer un score
// ============================================
router.post('/:id/score', authenticateToken, async (req, res) => {
  try {
    const { score } = req.body;
    const gameId = req.params.id;

    if (typeof score !== 'number' || score < 0) {
      return res.status(400).json({ error: 'Score invalide' });
    }

    // Vérifier que le jeu existe
    const game = await Game.findByPk(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Jeu non trouvé' });
    }

    // Récupérer le highscore actuel
    const [highScore, created] = await Highscore.findOrCreate({
      where: {
        id_user: req.user.id,
        id_game: gameId,
      },
      defaults: {
        score: score,
      },
    });

    // Mettre à jour si meilleur score
    let isNewHighscore = false;
    if (!created && score > highScore.score) {
      await highScore.update({ score });
      isNewHighscore = true;
    }

    res.json({
      message: isNewHighscore ? 'Nouveau record !' : 'Score enregistré',
      highScore: Math.max(highScore.score, score),
      isNewHighscore: isNewHighscore || created,
    });
  } catch (error) {
    console.error('Erreur POST score:', error);
    res.status(500).json({ error: "Erreur lors de l'enregistrement du score" });
  }
});

// ============================================
// GET /api/games/:id/leaderboard - Classement d'un jeu
// ============================================
router.get('/:id/leaderboard', async (req, res) => {
  try {
    const gameId = req.params.id;
    const limit = parseInt(req.query.limit) || 50;

    const leaderboard = await Highscore.findAll({
      where: { id_game: gameId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username'],
        },
      ],
      order: [['score', 'DESC']],
      limit,
    });

    const formattedLeaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      username: entry.user.username,
      score: entry.score,
      updatedAt: entry.updatedAt,
    }));

    res.json({ leaderboard: formattedLeaderboard });
  } catch (error) {
    console.error('Erreur leaderboard:', error);
    res
      .status(500)
      .json({ error: 'Erreur lors de la récupération du classement' });
  }
});

// ============================================
// GET /api/games/:id/my-score - Mon meilleur score
// ============================================
router.get('/:id/my-score', authenticateToken, async (req, res) => {
  try {
    const highScore = await Highscore.findOne({
      where: {
        id_user: req.user.id,
        id_game: req.params.id,
      },
    });

    if (!highScore) {
      return res.json({ score: null, message: 'Aucun score enregistré' });
    }

    res.json({
      score: highScore.score,
      updatedAt: highScore.updatedAt,
    });
  } catch (error) {
    console.error('Erreur my-score:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du score' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../database/models');

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// Middleware optionnel (permet anonymes)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }
  next();
};

// ============================================
// POST /api/auth/register - Inscription
// ============================================
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username et password requis' });
    }

    // Vérifier si username existe
    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res
        .status(409)
        .json({ error: "Ce nom d'utilisateur existe déjà" });
    }

    // Créer utilisateur
    const user = await User.create({
      username,
      email: email || null,
      password,
      displayName: displayName || username,
      isAnonymous: false,
    });

    // Générer token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.status(201).json({
      message: 'Compte créé avec succès',
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        totalXP: user.totalXP,
        currentStreak: user.currentStreak,
      },
    });
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
});

// ============================================
// POST /api/auth/login - Connexion
// ============================================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Identifiants requis' });
    }

    // Trouver utilisateur
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    // Vérifier mot de passe
    const validPassword = await user.validPassword(password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    // Générer token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        totalXP: user.totalXP,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
      },
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

// ============================================
// POST /api/auth/anonymous - Compte anonyme
// ============================================
router.post('/anonymous', async (req, res) => {
  try {
    // Générer username aléatoire
    const randomId = Math.random().toString(36).substring(2, 10);
    const username = `anon_${randomId}`;

    const user = await User.create({
      username,
      displayName: `Visiteur ${randomId}`,
      isAnonymous: true,
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, isAnonymous: true },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }, // Plus long pour anonymes
    );

    res.json({
      message: 'Compte anonyme créé',
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        isAnonymous: true,
        totalXP: 0,
        currentStreak: 0,
      },
    });
  } catch (error) {
    console.error('Erreur anonymous:', error);
    res
      .status(500)
      .json({ error: 'Erreur lors de la création du compte anonyme' });
  }
});

// ============================================
// GET /api/auth/me - Profil utilisateur
// ============================================
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        'id',
        'username',
        'email',
        'displayName',
        'avatar',
        'totalXP',
        'currentStreak',
        'longestStreak',
        'lastActiveDate',
        'isAnonymous',
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Erreur me:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
  }
});

// ============================================
// POST /api/auth/convert-anonymous - Convertir compte anonyme
// ============================================
router.post('/convert-anonymous', authenticateToken, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username et password requis' });
    }

    const user = await User.findByPk(req.user.id);

    if (!user.isAnonymous) {
      return res.status(400).json({ error: "Ce compte n'est pas anonyme" });
    }

    // Vérifier username disponible
    const existing = await User.findOne({
      where: { username },
      paranoid: false,
    });
    if (existing) {
      return res
        .status(409)
        .json({ error: "Ce nom d'utilisateur existe déjà" });
    }

    // Mettre à jour
    await user.update({
      username,
      email: email || null,
      password,
      displayName: username,
      isAnonymous: false,
    });

    // Nouveau token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.json({
      message: 'Compte converti avec succès',
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        totalXP: user.totalXP,
        currentStreak: user.currentStreak,
        isAnonymous: false,
      },
    });
  } catch (error) {
    console.error('Erreur convert:', error);
    res.status(500).json({ error: 'Erreur lors de la conversion du compte' });
  }
});

module.exports = { router, authenticateToken, optionalAuth };

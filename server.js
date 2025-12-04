const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./database/connection');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// API Routes - Système simplifié (Users, Games, Highscore)
const { router: authRouter } = require('./api/auth');
const gamesRouter = require('./api/games');
const scoresRouter = require('./api/scores');

app.use('/api/auth', authRouter);
app.use('/api/games', gamesRouter);
app.use('/api/users', scoresRouter);

// Routes frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/hub.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'hub.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'connected',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Démarrage serveur avec test DB
const startServer = async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`\n🚀 Serveur NIRD Academy démarré`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🎮 API: http://localhost:${PORT}/api`);
      console.log(`\n📚 Endpoints disponibles:`);
      console.log(`   AUTH:`);
      console.log(`   - POST /api/auth/register`);
      console.log(`   - POST /api/auth/login`);
      console.log(`   - GET  /api/auth/me`);
      console.log(`   GAMES:`);
      console.log(`   - GET  /api/games`);
      console.log(`   - GET  /api/games/:id`);
      console.log(`   - POST /api/games/:id/score`);
      console.log(`   - GET  /api/games/:id/leaderboard`);
      console.log(`   - GET  /api/games/:id/my-score`);
      console.log(`   USERS:`);
      console.log(`   - GET  /api/users/:id/scores`);
      console.log(`   - GET  /api/users/me/scores\n`);
    });
  } catch (error) {
    console.error('❌ Impossible de démarrer le serveur:', error.message);
    console.error(
      '\n💡 Vérifiez la configuration de la base de données dans .env',
    );
    process.exit(1);
  }
};

startServer();

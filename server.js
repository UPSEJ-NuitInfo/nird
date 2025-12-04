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
const { router: authRouter } = require('./api/auth_new');
const gamesRouter = require('./api/games');
const scoresRouter = require('./api/scores');

app.use('/api/auth', authRouter);
app.use('/api/games', gamesRouter);
app.use('/api/users', scoresRouter);

// API Calculator (legacy - compatibilité)
app.post('/api/calculate', (req, res) => {
  try {
    const calculator = require('./api/calculator');
    const result = calculator.compute(req.body);
    res.json(result);
  } catch (error) {
    console.error('Erreur calcul:', error);
    res.status(500).json({ error: 'Erreur lors du calcul' });
  }
});

// API Data - Récupérer données JSON (legacy)
app.get('/api/data/:type', (req, res) => {
  try {
    const dataType = req.params.type;
    const data = require(`./data/${dataType}.json`);
    res.json(data);
  } catch (error) {
    console.error('Erreur données:', error);
    res.status(404).json({ error: 'Données non trouvées' });
  }
});

// Routes frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
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
      console.log(`\n🚀 Serveur NIRD Academy (Duolingo) démarré`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`📊 Base: ${process.env.DB_NAME || 'nird_academy'}`);
      console.log(`🎮 API: http://localhost:${PORT}/api`);
      console.log(`\n📚 Endpoints disponibles:`);
      console.log(`   - POST /api/auth/register`);
      console.log(`   - POST /api/auth/login`);
      console.log(`   - POST /api/auth/anonymous`);
      console.log(`   - GET  /api/lessons`);
      console.log(`   - GET  /api/exercises/:id`);
      console.log(`   - POST /api/exercises/:id/submit`);
      console.log(`   - GET  /api/users/profile`);
      console.log(`   - GET  /api/users/leaderboard\n`);
    });
  } catch (error) {
    console.error('❌ Impossible de démarrer le serveur:', error.message);
    console.error(
      '\n💡 Vérifiez que MariaDB est démarré et configuré dans .env',
    );
    process.exit(1);
  }
};

startServer();

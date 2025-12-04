const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// API Calculator
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

// API Data - Récupérer données JSON
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

// Route principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route Candy Map
app.get('/map', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'map.html'));
});

// Démarrage serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur NIRD lancé sur http://localhost:${PORT}`);
  console.log(`📊 API disponible sur /api/calculate et /api/data/:type`);
});

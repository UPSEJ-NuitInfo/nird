const { User, Game, Highscore } = require('./models');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    console.log('🌱 Début du seeding...');

    // ============================================
    // 1. Créer des jeux
    // ============================================
    console.log('Création des jeux...');

    const games = await Game.bulkCreate([
      { id: 1, name: 'Dino' },
      { id: 2, name: 'Fruit Ninja' },
      { id: 3, name: 'Guitar Hero' },
      { id: 4, name: 'Taupe Taupe' },
      { id: 5, name: 'Laser Game' },
    ]);

    console.log(`✅ ${games.length} jeux créés`);

    // ============================================
    // 2. Créer utilisateur de démo
    // ============================================
    console.log('Création utilisateur démo...');

    const demoPassword = await bcrypt.hash('demo123', 10);

    const demoUser = await User.create({
      username: 'demo',
      password: demoPassword,
    });

    console.log(`✅ Utilisateur démo créé (username: demo, password: demo123)`);

    // ============================================
    // 3. Créer quelques scores de démo
    // ============================================
    console.log('Création scores de démo...');

    await Highscore.bulkCreate([
      { id_user: demoUser.id, id_game: 1, score: 22 },
      { id_user: demoUser.id, id_game: 2, score: 80 },
      { id_user: demoUser.id, id_game: 3, score: 134000 },
    ]);

    console.log('✅ 3 scores de démo créés');

    console.log('\n🎉 Seeding terminé avec succès !');
    console.log('\n📊 Base de données peuplée :');
    console.log(`   - ${games.length} jeux`);
    console.log(`   - 1 utilisateur de test (demo/demo123)`);
    console.log(`   - 3 scores de démo`);
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    throw error;
  }
}

// Exécution si appelé directement
if (require.main === module) {
  const sequelize = require('./connection');

  seed()
    .then(() => {
      console.log('\n✅ Script seed terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Échec du seed:', error);
      process.exit(1);
    });
}

module.exports = seed;

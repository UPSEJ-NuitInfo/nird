const { sequelize } = require('./models');

const migrate = async () => {
  try {
    console.log('🔄 Début de la migration de la base de données...');

    // Synchronisation des modèles (crée les tables si elles n'existent pas)
    await sequelize.sync({ force: false, alter: true });

    console.log('✅ Migration terminée avec succès !');
    console.log('📊 Tables créées :');
    console.log('   - Users');
    console.log('   - Games');
    console.log('   - Highscores');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
};

migrate();

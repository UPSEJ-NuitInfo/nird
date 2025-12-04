const { Sequelize } = require('sequelize');
require('dotenv').config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

let sequelize;

if (isProduction) {
  // Production: MariaDB
  const dbName = process.env.DB_NAME || 'nird_academy';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || 3306;

  console.log(
    `🔧 Configuration DB: ${dbUser}@${dbHost}:${dbPort}/${dbName} [${nodeEnv}]`,
  );

  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'mariadb',
    dialectOptions: {
      connectTimeout: 10000,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  });
} else {
  // Development: SQLite
  console.log(`🔧 Configuration DB: SQLite (./database/nird.db) [${nodeEnv}]`);

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/nird.db',
    logging: false,
  });
}

// Test de connexion
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    const dbType = isProduction ? 'MariaDB' : 'SQLite';
    console.log(`✅ Connexion ${dbType} établie avec succès`);
  } catch (error) {
    console.error(
      '❌ Impossible de se connecter à la base de données:',
      error.message,
    );
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection };

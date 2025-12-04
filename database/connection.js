const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbName = process.env.DB_NAME || 'nird_academy';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 3306;
const nodeEnv = process.env.NODE_ENV || 'development';

console.log(
  `🔧 Configuration DB: ${dbUser}@${dbHost}:${dbPort}/${dbName} [${nodeEnv}]`,
);

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
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
  logging: nodeEnv === 'development' ? console.log : false,
});

// Test de connexion
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion MariaDB établie avec succès');
  } catch (error) {
    console.error('❌ Impossible de se connecter à MariaDB:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection };

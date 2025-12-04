const { DataTypes } = require('sequelize');
const { sequelize } = require('./connection');
const bcrypt = require('bcrypt');

// ============================================
// MODÈLE USER
// ============================================
const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50],
        isAlphanumeric: true,
      },
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password') && user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  },
);

// Méthode pour vérifier le mot de passe
User.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// ============================================
// MODÈLE GAME TYPE (Types de mini-jeux)
// ============================================
const Game = sequelize.define(
  'Game',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

// ============================================
// MODÈLE Highscore
// ============================================
const Highscore = sequelize.define(
  'Highscore',
  {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    id_game: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Game',
        key: 'id',
      },
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

// ============================================
// RELATIONS
// ============================================

User.belongsToMany(Game, {
  through: Highscore,
  foreignKey: 'id_user',
  as: 'games',
});
Game.belongsToMany(User, {
  through: Highscore,
  foreignKey: 'id_game',
  as: 'users',
});

Highscore.belongsTo(User, { foreignKey: 'id_user', as: 'user' });
Highscore.belongsTo(Game, { foreignKey: 'id_game', as: 'game' });

module.exports = {
  sequelize,
  User,
  Game,
  Highscore,
};

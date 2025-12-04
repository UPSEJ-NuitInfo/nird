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
    // totalXP: {
    //   type: DataTypes.INTEGER,
    //   defaultValue: 0,
    // },
    // currentStreak: {
    //   type: DataTypes.INTEGER,
    //   defaultValue: 0,
    // },
    // longestStreak: {
    //   type: DataTypes.INTEGER,
    //   defaultValue: 0,
    // },
    // lastActiveDate: {
    //   type: DataTypes.DATEONLY,
    //   allowNull: true,
    // },
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
    // description: {
    //   type: DataTypes.TEXT,
    //   allowNull: true,
    // },
    // icon: {
    //   type: DataTypes.STRING(50),
    //   defaultValue: 'fa-gamepad',
    // },
    // xpReward: {
    //   type: DataTypes.INTEGER,
    //   defaultValue: 10,
    // },
    // isActive: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: true,
    // },
  },
  {
    timestamps: true,
  },
);

// ============================================
// MODÈLE HighScore
// ============================================
const HighScore = sequelize.define(
  'HighScore',
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
// MODÈLE ACHIEVEMENT (Succès/Badges)
// ============================================
// const Achievement = sequelize.define(
//   'Achievement',
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     code: {
//       type: DataTypes.STRING(50),
//       allowNull: false,
//       unique: true,
//     },
//     name: {
//       type: DataTypes.STRING(100),
//       allowNull: false,
//     },
//     description: {
//       type: DataTypes.TEXT,
//     },
//     icon: {
//       type: DataTypes.STRING(255),
//     },
//     tier: {
//       type: DataTypes.ENUM('bronze', 'silver', 'gold', 'platinum'),
//       defaultValue: 'bronze',
//     },
//     requirement: {
//       type: DataTypes.JSON,
//       // {type: "xp", value: 500} ou {type: "streak", value: 7} etc.
//     },
//     xpBonus: {
//       type: DataTypes.INTEGER,
//       defaultValue: 0,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// ============================================
// MODÈLE USER ACHIEVEMENT (Badges obtenus)
// ============================================
// const UserAchievement = sequelize.define(
//   'UserAchievement',
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'User',
//         key: 'id',
//       },
//     },
//     achievementId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'Achievements',
//         key: 'id',
//       },
//     },
//     unlockedAt: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//   },
//   {
//     timestamps: true,
//     indexes: [
//       {
//         unique: true,
//         fields: ['userId', 'achievementId'],
//       },
//     ],
//   },
// );

// ============================================
// RELATIONS
// ============================================

User.belongsToMany(Game, {
  through: HighScore,
  foreignKey: 'id_user',
  as: 'user',
});
Game.belongsToMany(User, {
  through: HighScore,
  foreignKey: 'id_game',
  as: 'game',
});

// User.hasMany(UserAchievement, { foreignKey: 'userId', as: 'achievements' });
// UserAchievement.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Game,
  HighScore,
  // Achievement,
  // UserAchievement,
};

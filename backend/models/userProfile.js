// Import necessary modules
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');

let sqlPassword = null;

try {
    const configData = fs.readFileSync('config.json');
    const config = JSON.parse(configData);
    sqlPassword = config.sql_password;
  } catch (err) {
      console.error('Error reading config file:', err);
  }

// Create Sequelize instance and connect to MySQL database
const sequelize = new Sequelize('sys', 'root', sqlPassword, {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql'
});

const UserProfile = sequelize.define('UserProfile', {
  userId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: true
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imageName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isWishlistVisible: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true,
  modelName: 'userProfile',
  tableName: 'userProfiles'
});

// Sync the model with the database
(async () => {
  try {
    await UserProfile.sync({ alter: true });
    console.log('User Profile model synced successfully');
  } catch (error) {
    console.error('Error syncing user profile model:', error);
  }
})();

module.exports = UserProfile;
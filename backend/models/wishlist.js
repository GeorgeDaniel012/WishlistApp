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

// Define the Wishlist model
const Wishlist = sequelize.define('Wishlist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  typeOfMedia: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mediaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true,
  underscored: true,
  modelName: 'wishlist',
  tableName: 'wishlists' // Name of the table in the database
});

// Sync the model with the database
(async () => {
  try {
    await Wishlist.sync({ alter: true });
    console.log('Wishlist model synced successfully');
  } catch (error) {
    console.error('Error syncing wishlist model:', error);
  }
})();

module.exports = Wishlist;
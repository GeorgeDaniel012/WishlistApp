const express = require('express');
const { Sequelize } = require('sequelize');
const bodyParser = require('body-parser');
const wishlistRoutes = require('./routers/wishlistRoutes.js');
const userProfileRoutes = require('./routers/userProfileRoutes.js');
const {igdbRoutes} = require('./api-calls/igdbApiRoutes.js');
const {tmdbRoutes} = require('./api-calls/tmdbApiRoutes.js');

const app = express();
const fs = require('fs');

/*
config.json file format:
{
    "IGDB_CLIENT_ID" : "",
    "IGDB_ACCESS_TOKEN" : "",
    "TMDB_AUTHORIZATION" : "",
    "sql_password" : "",
    "db_name" : ""
}
*/

let IGDB_CLIENT_ID = null;
let IGDB_ACCESS_TOKEN = null;
let sql_password = null;
let dbName = null;

const axios = require('axios');

// reading config data
try {
  const configData = fs.readFileSync('config.json');
  const config = JSON.parse(configData);
  IGDB_CLIENT_ID = config.IGDB_CLIENT_ID;
  IGDB_ACCESS_TOKEN = config.IGDB_ACCESS_TOKEN;
  sql_password = config.sql_password;
  dbName = config.db_name;
} catch (err) {
    console.error('Error reading config file:', err);
}

const PORT = 3000;

const sequelize = new Sequelize(dbName, 'root', '', {
  dialect: 'mysql',
  host: 'localhost',
  password: sql_password
});

sequelize.sync();

app.use(express.json());

app.use('/wishlist', wishlistRoutes);
app.use('/igdbapi', igdbRoutes);
app.use('/tmdbapi', tmdbRoutes);
app.use('/userprofile', userProfileRoutes);

// Define a route that responds with a message
app.get('/', (req, res) => {
  res.send('Hello from Node.js backend!');
});

// Route for handling other requests that require authentication
// app.use((req, res, next) => {
//   const token = req.headers.authorization;
//   if (token !== '') {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
//   next();
// });

// Starts the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



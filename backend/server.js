const express = require('express');
const { Sequelize } = require('sequelize');
const bodyParser = require('body-parser');
const wishlistRoutes = require('./routers/wishlistRoutes.js');
const igdbRoutes = require('./api-calls/igdbApiRoutes.js');
const tmdbRoutes = require('./api-calls/tmdbApiRoutes.js');

const app = express();
const fs = require('fs');

let IGDB_CLIENT_ID = null;
let IGDB_ACCESS_TOKEN = null;
let sql_password = null;
let dbName = null;

const axios = require('axios');

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

const User = sequelize.define('User', {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
});

sequelize.sync();

app.use(express.json());

// Endpoints
app.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const user = await User.create({ name, email });
  res.json(user);
});
app.use(bodyParser.json());


app.use('/wishlist', wishlistRoutes);
app.use('/igdbapi', igdbRoutes);
app.use('/tmdbapi', tmdbRoutes);

// Define a route that responds with a message
app.get('/', (req, res) => {
  res.send('Hello from Node.js backend!');
});

/*
app.post('/search', (req, res) => {
  const { query } = req.body;
  console.log('Received search query:', query);

  // Here you can process the search query (e.g., query a database, perform a search operation)
  // For demonstration purposes, let's simply send back a response with the received query
  res.json({ message: `Received search query: ${query}` });
});

app.use((req, res, next) => {
  const token = req.headers.authorization;
  if (token !== '') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
});
*/

app.post('/search', (req, res) => {
  const query = req.body.query;
  console.log('Received search query:', query);

  // Here you can process the search query (e.g., query a database, perform a search operation)
  // For demonstration purposes, let's simply send back a response with the received query
  let message_ = 'Received search query: ' + query;
  res.json({ message: message_});
});


// Route for handling other requests that require authentication
// app.use((req, res, next) => {
//   const token = req.headers.authorization;
//   if (token !== '') {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
//   next();
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

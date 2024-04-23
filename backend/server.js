const express = require('express');
const { Sequelize } = require('sequelize');
const bodyParser = require('body-parser');
const wishlistRoutes = require('./routers/wishlistRoutes.js')

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

// Function to fetch data from IGDB API
async function fetchGameInfo() {
  try {
    // Make a POST request to the IGDB API
    const response = await axios({
      url: 'https://api.igdb.com/v4/games',
      method: 'POST',
      headers: {
        'Client-ID': IGDB_CLIENT_ID,
        'Authorization': `Bearer ${IGDB_ACCESS_TOKEN}`,
        'Accept': 'application/json'
      },
      data: 'fields name,release_dates,platforms; limit 10;'
    });

    // Process the response data
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching data from IGDB API:', error);
  }
}

// Function to fetch a game by ID from IGDB API
async function fetchGameInfoById(gameId) {
  try {
    // Make a POST request to the IGDB API
    const response = await axios({
      url: `https://api.igdb.com/v4/games/`,
      method: 'POST',
      headers: {
        'Client-ID': IGDB_CLIENT_ID,
        'Authorization': `Bearer ${IGDB_ACCESS_TOKEN}`,
        'Accept': 'application/json'
      },
      data: `fields *; where id = ${gameId};`
    });

    // Process the response data
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching game from IGDB API:', error);
  }
}

// Call the function to fetch data
//fetchGameInfoById(95080);
//fetchGameInfo();

// Function to fetch images for a game by ID from IGDB API
async function fetchGameImages(gameId) {
  try {
    // Make a POST request to the IGDB API for artwork
    const response = await axios({
      url: 'https://api.igdb.com/v4/covers/',
      method: 'POST',
      headers: {
        'Client-ID': IGDB_CLIENT_ID,
        'Authorization': `Bearer ${IGDB_ACCESS_TOKEN}`,
        'Accept': 'application/json'
      },
      data: `fields *; where game = ${gameId};`
    });

    // Process the response data
    //console.log(response.data);
    let id = response.data[0].image_id;
    let url = response.data[0].url;
    let urlModified = url.replace("t_thumb", "t_cover_big");
    console.log(urlModified);
  } catch (error) {
    console.error('Error fetching game images from IGDB API:', error);
  }
}

async function fetchGameImagesBig(imageId) {
  try {
    // Make a POST request to the IGDB API for artwork
    const response = await axios({
      url: 'https://api.igdb.com/v4/covers/',
      method: 'POST',
      headers: {
        'Client-ID': IGDB_CLIENT_ID,
        'Authorization': `Bearer ${IGDB_ACCESS_TOKEN}`,
        'Accept': 'application/json'
      },
      data: `fields *; where id = ${imageId};`
    });

    // Process the response data
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching game images from IGDB API:', error);
  }
}

// Call the function to fetch images for a game by ID
fetchGameImages(425); // Replace 123 with the actual game ID you want to fetch images for


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

// Define a route that responds with a message
app.get('/', (req, res) => {
  res.send('Hello from Node.js backend!');
});

app.use((req, res, next) => {
  const token = req.headers.authorization;
  if (token !== '') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

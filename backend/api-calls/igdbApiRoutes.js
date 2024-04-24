const fs = require('fs');
const axios = require('axios');

const express = require('express');
const router = express.Router();

try {
    const configData = fs.readFileSync('./config.json');
    const config = JSON.parse(configData);
    console.log(config);
    IGDB_CLIENT_ID = config.IGDB_CLIENT_ID;
    IGDB_ACCESS_TOKEN = config.IGDB_ACCESS_TOKEN;
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
  
  // Function to fetch a game by ID from IGDB API
  async function fetchGameInfoByName(gameName) {
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
        data: `search "${gameName}"; fields *; limit 50;"`//`fields *; where name = ${gameName};`
      });
    const transformedArray = response.data.map(item => ({
        name: item.name,
        id: item.id,
        imageUrl: null
    }));

    const gameIds = transformedArray.map(item => item.id);
    console.log("size: ", gameIds.length);
    
    let imageUrlsMap = await fetchGameImages(gameIds);
    for(let ob of transformedArray){
        if(imageUrlsMap.hasOwnProperty(ob.id)){
            ob.imageUrl = imageUrlsMap[ob.id];
        }
    }
    return transformedArray;
    } catch (error) {
      console.error('Error fetching game from IGDB API:', error);
    }
  }
  
  // Call the function to fetch data
  //fetchGameInfoById(95080);
  //fetchGameInfo();
  
  // Function to fetch images for a game by ID from IGDB API
  async function fetchGameImage(gameId) {
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
      let urlModified = "https:" + url.replace("t_thumb", "t_cover_big");
      console.log(urlModified);

      return urlModified;
    } catch (error) {
      console.error('Error fetching game images from IGDB API:', error);
      return null;
    }

  }
  
  async function fetchGameImages(gameIds) {
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
        data: `fields game, url; limit 50; where game = ${JSON.stringify(gameIds).replace("[", "(").replace("]", ")")};`
      });
  
      // Process the response data
      const urlsMap = response.data.reduce((acc, item) => {
        acc[item.game] = "https:" + item.url.replace("t_thumb", "t_cover_big");
        return acc;
    }, {});

      //console.log(urlsMap);
      return urlsMap;
      //const urlsArray = response.data.map(obj => "https:" + obj.url.replace("t_thumb", "t_cover_big"));
      //console.log(response.data);
      //console.log(urlsArray);
      //let urlModified = "https:" + url.replace("t_thumb", "t_cover_big");
      //console.log(urlModified);

      //console.log(urlsArray);
      //return urlsArray;
    } catch (error) {
      console.error('Error fetching game images from IGDB API:', error);
      return null;
    }

  }
       
// Call the function to fetch images for a game by ID
//fetchGameImages(425); // Replace 123 with the actual game ID you want to fetch images for
//fetchGameInfoByName("league");
//fetchGameInfoById(36308)


//Testing
/*(async ()=>{
    let test=await fetchGameInfoByName("halo");
    console.log(test);
})();*/

//fetchGameImages([425, 40112]);

//fetchGameImages([36308, 108485, 123]);


router.get('/:searchString', async (req, res) => {
    try {
        const name = req.params.searchString;
        const games = await fetchGameInfoByName(name);
        res.json(games);
    } catch (error) {
        console.error('Error contacting IGDB api:', error);
        res.status(500).json({ message: 'Error contacting IGDB api' });
    }
});

module.exports = router;
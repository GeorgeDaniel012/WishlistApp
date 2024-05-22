const fs = require('fs');
const axios = require('axios');

const express = require('express');
const igdbRoutes = express.Router();


try {
  const configData = fs.readFileSync('./config.json');
  const config = JSON.parse(configData);
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
  async function fetchGamesInfoByName(gameName) {
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
        data: `search "${gameName}"; fields name, id; limit 50;"`//`fields *; where name = ${gameName};`
      });
    const transformedArray = response.data.map(item => ({
        name: item.name,
        id: item.id,
        imageUrl: null,
        typeOfMedia: 'game'
    }));

    const gameIds = transformedArray.map(item => item.id);
    console.log("size: ", gameIds.length);

    if(gameIds.length === 0){
      return [];
    }
    
    let imageUrlsMap = await fetchGameImages(gameIds);
    for(let ob of transformedArray){
        if(imageUrlsMap.hasOwnProperty(ob.id)){
            ob.imageUrl = imageUrlsMap[ob.id];
        } else {
          // console.log(ob.imageUrl)
          ob.imageUrl = 'https://i.imgur.com/VCMGiHY.png';
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
      if(response.data.length == 0){
        return;
      }
      let id = response.data[0].image_id;
      let url = response.data[0].url;
      let urlModified = "https:" + url.replace("t_thumb", "t_1080p");

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
      data: `fields id, name, summary, genres, platforms, screenshots.*; where id = ${gameId};`
    });
    imageUrl = await fetchGameImage(gameId);
    // Process the response data
    response.data[0].imageUrl = imageUrl;
    if(typeof response.data[0].genres !== 'undefined' && response.data[0].genres.length != 0){
      response.data[0].genres = await fetchGenreNames(response.data[0].genres);
    }
    if(typeof response.data[0].platforms !== 'undefined' && response.data[0].platforms.length != 0){
      response.data[0].platforms = await fetchPlatformNames(response.data[0].platforms);
    }
    //console.log(imageUrl);
    if(typeof response.data[0].screenshots !== 'undefined' && response.data[0].screenshots.length != 0){
      response.data[0].screenshots = response.data[0].screenshots.map(screenshot => "https:" + screenshot.url.replace("t_thumb", "t_cover_big"));
    }
    
    return response.data[0];
  } catch (error) {
    console.error('Error fetching game from IGDB API:', error);
  }
}


async function fetchGenreNames(genreIds) {
  try {
    const response = await axios({
      url: 'https://api.igdb.com/v4/genres/',
      method: 'POST',
      headers: {
        'Client-ID': IGDB_CLIENT_ID,
        'Authorization': `Bearer ${IGDB_ACCESS_TOKEN}`,
        'Accept': 'application/json'
      },
      data: `fields name; limit 50; where id = ${JSON.stringify(genreIds).replace("[", "(").replace("]", ")")};`
    });

    // Process the response data
    const transformedArray = response.data.map(elem => elem.name);
    return transformedArray;


  } catch (error) {
    console.error('Error fetching genre info from IGDB API:', error);
    return null;
  }

}

async function fetchPlatformNames(platformIds) {
  try {
    const response = await axios({
      url: 'https://api.igdb.com/v4/platforms',
      method: 'POST',
      headers: {
        'Client-ID': IGDB_CLIENT_ID,
        'Authorization': `Bearer ${IGDB_ACCESS_TOKEN}`,
        'Accept': 'application/json'
      },
      data: `fields name; limit 50; where id = ${JSON.stringify(platformIds).replace("[", "(").replace("]", ")")};`
    });

    // Process the response data
    const transformedArray = response.data.map(elem => elem.name);
    return transformedArray;


  } catch (error) {
    console.error('Error fetching genre info from IGDB API:', error);
    return null;
  }

}


async function fetchGameScreenshots(gameId) {
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
    let urlModified = "https:" + url.replace("t_thumb", "t_1080p");

    return urlModified;
  } catch (error) {
    console.error('Error fetching game images from IGDB API:', error);
    return null;
  }

}

async function fetchGamesInfoByIds(listOfIds) {
  //console.log('PLEASE HELP ME\n\n', JSON.stringify(listOfIds).replace("[", "(").replace("]", ")"));
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
      data: `fields id, name; where id = ${JSON.stringify(listOfIds).replace("[", "(").replace("]", ")")};"`//`fields *; where name = ${gameName};`
    });
  const transformedArray = response.data.map(item => ({
      name: item.name,
      id: item.id,
      imageUrl: null,
      typeOfMedia: 'game'
  }));

  const gameIds = transformedArray.map(item => item.id);
  console.log("size: ", gameIds.length);
  
  let imageUrlsMap = await fetchGameImages(gameIds);
  for(let ob of transformedArray){
      if(imageUrlsMap.hasOwnProperty(ob.id)){
          ob.imageUrl = imageUrlsMap[ob.id];
      } else {
        // console.log(ob.imageUrl)
        ob.imageUrl = 'https://i.imgur.com/VCMGiHY.png';
      }
  }
  
  return transformedArray;
  } catch (error) {
    console.error('Error fetching game from IGDB API:', error);
  }
}


//Testing
/*(async ()=>{
    let test=await fetchGameInfoById(123);
    console.log(test);

    //fetchGenreNames([12,31]);
})();*/

//fetchGameImages([425, 40112]);

//fetchGameImages([36308, 108485, 123]);

igdbRoutes.get('/:searchString', async (req, res) => {
    try {
        const name = req.params.searchString;
        const games = await fetchGamesInfoByName(name);
        res.json(games);
    } catch (error) {
        console.error('Error contacting IGDB api:', error);
        res.status(500).json({ message: 'Error contacting IGDB api' });
    }
});

igdbRoutes.get('/id/:gameId', async (req, res) => {
  try {
      const id = req.params.gameId;
      const game = await fetchGameInfoById(id);
      res.json(game);
  } catch (error) {
      console.error('Error contacting IGDB api:', error);
      res.status(500).json({ message: 'Error contacting IGDB api' });
  }
});

//igdbRoutes.get('/wishlistEntry/:')





//const igdbRoutes = igdbRoutes;
module.exports = {igdbRoutes, fetchGamesInfoByIds};
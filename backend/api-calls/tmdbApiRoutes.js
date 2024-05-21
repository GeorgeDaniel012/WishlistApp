const fs = require('fs');
const axios = require('axios');

const express = require('express');
const tmdbRoutes = express.Router();
// tmdb exclusive
//const fetch = require('node-fetch');


try {
    const configData = fs.readFileSync('./config.json');
    const config = JSON.parse(configData);
    TMDB_AUTHORIZATION = config.TMDB_AUTHORIZATION;
  } catch (err) {
      console.error('Error reading config file:', err);
  }

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error('error:' + err));

// It used to use the IMDB ID
async function fetchMovieShowInfoById(mediaId, mediaType){
    //const url = 'https://api.themoviedb.org/3/find/' + mediaId + '?external_source=imdb_id';

    const url = 'https://api.themoviedb.org/3/' + mediaType + '/' + mediaId;

    const response = await axios({
        url: url,
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_AUTHORIZATION}`
        }
    });
    //console.log(response.data);

    return response.data;
}

//fetchMovieShowInfoById('tt15239678');
//fetchMovieShowInfoById(253514, 'tv');

//It gives another ID, the TMDB ID?
async function fetchMovieShowInfoByName(mediaName){
    // for the first search page
    const url = 'https://api.themoviedb.org/3/search/multi?query=' + mediaName + '&include_adult=false&page=1';

    const response = await axios({
        url: url,
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_AUTHORIZATION}`
        }
    });

    // for the second search page
    const url2 = 'https://api.themoviedb.org/3/search/multi?query=' + mediaName + '&include_adult=false&page=2';

    const response2 = await axios({
        url: url2,
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_AUTHORIZATION}`
        }
    });

    const allResults = response.data.results.concat(response2.data.results);
    const filteredArray = allResults.filter(obj => obj.media_type !== 'person');

    //console.log(filteredArray);

    const arrayOfResults = filteredArray.map(item => ({
        //name: item.original_name,
        name: typeof item.original_name === "undefined" ? item.original_title : item.original_name,
        id: item.id,
        //imageUrl: 'http://image.tmdb.org/t/p/original/' + item.poster_path
        imageUrl: typeof item.poster_path === "undefined" || item.poster_path === null
            ? 'https://i.imgur.com/VCMGiHY.png'
            : 'http://image.tmdb.org/t/p/original/' + item.poster_path,
        typeOfMedia: item.media_type
    }));

    //console.log('aaaaa');
    //console.log(arrayOfResults);
    return arrayOfResults;
}

//fetchMovieShowInfoByName('house');

tmdbRoutes.get('/:searchString', async (req, res) => {
    try {
        const name = req.params.searchString;
        const moviesAndShows = await fetchMovieShowInfoByName(name);
        res.json(moviesAndShows);
    } catch (error) {
        console.error('Error contacting TMDB api:', error);
        res.status(500).json({ message: 'Error contacting TMDB api' });
    }
});

tmdbRoutes.get('/id/:mediaType/:mediaId', async (req, res) => {
    try {
        const id = req.params.mediaId;
        const mediaType = req.params.mediaType;
        const media = await fetchMovieShowInfoById(id, mediaType);
        res.json(media);
    } catch (error) {
        console.error('Error contacting TMDB api:', error);
        res.status(500).json({ message: 'Error contacting TMDB api' });
    }
  });

module.exports = {tmdbRoutes, fetchMovieShowInfoById};
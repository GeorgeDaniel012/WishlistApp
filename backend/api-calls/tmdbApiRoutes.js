const fs = require('fs');
const axios = require('axios');

const express = require('express');
const router = express.Router();
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

// It used the IMDB ID
async function fetchMovieShowInfoById(mediaId){
    const url = 'https://api.themoviedb.org/3/find/' + mediaId + '?external_source=imdb_id';

    const response = await axios({
        url: url,
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_AUTHORIZATION}`
        }
    });
    console.log(response.data);
}

//fetchMovieShowInfoById('tt15239678');

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

    console.log(allResults);

    const arrayOfResults = allResults.map(item => ({
        //name: item.original_name,
        name: typeof item.original_name == "undefined" ? item.original_title : item.original_name,
        id: item.id,
        imageUrl: 'http://image.tmdb.org/t/p/original/' + item.poster_path
    }));

    //console.log(arrayOfResults);
    return arrayOfResults;
}

//fetchMovieShowInfoByName('house');

router.get('/:searchString', async (req, res) => {
    try {
        const name = req.params.searchString;
        const moviesAndShows = await fetchMovieShowInfoByName(name);
        res.json(moviesAndShows);
    } catch (error) {
        console.error('Error contacting TMDB api:', error);
        res.status(500).json({ message: 'Error contacting TMDB api' });
    }
});

module.exports = router;
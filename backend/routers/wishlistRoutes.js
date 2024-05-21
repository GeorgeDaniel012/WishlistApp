const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist');

const {fetchGamesInfoByIds} = require("../api-calls/igdbApiRoutes");
const {fetchMovieShowInfoById} = require("../api-calls/tmdbApiRoutes");

// Route to add an item to a user's wishlist
router.post('/add', async (req, res) => {
  try {
    const { userId, typeOfMedia, mediaId } = req.body;

    // Check if the item already exists in the wishlist
    const existingItem = await Wishlist.findOne({
      where: { userId, typeOfMedia, mediaId }
    });

    if (existingItem) {
      console.error('Item is already in the wishlist')
      res.status(400).json({ message: 'Item is already in the wishlist' });
      return;
    }

    // If the item does not exist, create a new wishlist item
    const newItem = await Wishlist.create({ userId, typeOfMedia, mediaId, status: 'planning' });
    res.status(201).json({ message: 'Item added to wishlist successfully' });
  } catch (error) {
    console.error('Error adding item to wishlist:', error);
    res.status(500).json({ message: 'Error adding item to wishlist' });
  }
});

// Route to get all items of a user's wishlist
router.get('/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const wishlistItems = await Wishlist.findAll({ where: { userId } });
    let newArr = wishlistItems.map(item => item.dataValues);
    const wishlistItemsParsed = await transformJsonToJson(newArr); // Assuming Sequelize returns instances
    
    res.json(wishlistItemsParsed);
  } catch (error) {
    console.error('Error getting wishlist items:', error);
    res.status(500).json({ message: 'Error getting wishlist items' });
  }
});

// Route to delete an item from a user's wishlist
router.delete('/:id', async (req, res) => {
    try {
        const wishlistItemId = req.params.id;
        await Wishlist.destroy({ where: { id: wishlistItemId } });
        res.json({ message: 'Item deleted from wishlist successfully' });
    } catch (error) {
        console.error('Error deleting item from wishlist:', error);
        res.status(500).json({ message: 'Error deleting item from wishlist' });
  }
});

router.put('/', async (req, res) => {
    try {
        const { id, status } = req.body;
        const existingItem = await Wishlist.findOne({
            where: { id }
        });

        if(existingItem){
            existingItem.status = status;
            await existingItem.save();
        }
        res.json({ message: 'Item updated successfully' });
    } catch (error) {
        console.error('Error updating item in wishlist:', error);
        res.status(500).json({ message: 'Error updating item in wishlist' });
    }
})


//json to profile json (wishlist entries)
/*{
  "id"
  "userId"
  "typeOfMedia"
  "mediaId"
  "createdAt"
  "updatedAt"
} =>
{
  name
  id
  typeOfMedia
  imageUrl
}
*/
async function transformJsonToJson(mediaList){
    let newList=[];
    const gameMediaIds = mediaList.filter(media => media.typeOfMedia === "game").map(media => media.mediaId);
    const gameMediaStatus = mediaList.filter(media => media.typeOfMedia === "game").map(media => media.status);
    const gameWishlsitIds = mediaList.filter(media => media.typeOfMedia === "game").map(media => media.id);
    let gameMediaIdsMap={};
    for (let i=0; i<gameMediaIds.length; i++){
        gameMediaIdsMap[gameMediaIds[i]]=i;
    }
    
    let resultGames = await fetchGamesInfoByIds(gameMediaIds);
    // resultGames.forEach(obj => {
    //     obj.sortId = gameMediaIdsMap[obj.id];
    //     //obj.status = gameMediaStatus[i];
    // });
    for(let i = 0; i < resultGames.length; i++){
        let obj = resultGames[i]
        obj.sortId = gameMediaIdsMap[obj.id];
        obj.status = gameMediaStatus[i];
        obj.wishlistId = gameWishlsitIds[i];
    }
    resultGames.sort((a, b) => a.sortId - b.sortId);

    const movieOrTvPromises = mediaList
        .filter(media => media.typeOfMedia === 'movie' || media.typeOfMedia === 'tv')
        .map(async (media) => ({
            ...(await fetchMovieShowInfoById(media.mediaId, media.typeOfMedia)),
            typeOfMedia: media.typeOfMedia,
            status: media.status,
            wishlistId: media.id
        }));
    movieOrTvPromises
    
    let movieOrTv = await Promise.all(movieOrTvPromises);    
    
    movieOrTv = movieOrTv.map(obj => 
        ({name: (typeof(obj.title)==='undefined' ? obj.name : obj.title), 
        id: obj.id,  
        typeOfMedia: obj.typeOfMedia, 
        imageUrl: 'http://image.tmdb.org/t/p/original'+obj.poster_path,
        status: obj.status,
        wishlistId: obj.wishlistId
    }))

    return [...resultGames,...movieOrTv];
}
module.exports = router;
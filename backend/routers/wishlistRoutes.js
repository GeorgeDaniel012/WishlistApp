const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist');



// Route to add an item to a user's wishlist
router.post('/add', async (req, res) => {
  try {
    console.log(req.body);
    const { userId, typeOfMedia, mediaId } = req.body;
    const newItem = await Wishlist.create({ userId, typeOfMedia, mediaId });
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
    res.json(wishlistItems);
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

module.exports = router;
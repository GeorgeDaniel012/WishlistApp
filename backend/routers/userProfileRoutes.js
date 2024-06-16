const express = require('express');
const router = express.Router();
const UserProfile = require('../models/userProfile.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Route to add an item to a user's wishlist
// router.post('/add', async (req, res) => {
//   try {
//     const { userId, typeOfMedia, mediaId } = req.body;

//     // Check if the item already exists in the wishlist
//     const existingItem = await Wishlist.findOne({
//       where: { userId, typeOfMedia, mediaId }
//     });

//     if (existingItem) {
//       console.error('Item is already in the wishlist')
//       res.status(400).json({ message: 'Item is already in the wishlist' });
//       return;
//     }

//     // If the item does not exist, create a new wishlist item
//     const newItem = await Wishlist.create({ userId, typeOfMedia, mediaId, status: 'planning' });
//     res.status(201).json({ message: 'Item added to wishlist successfully' });
//   } catch (error) {
//     console.error('Error adding item to wishlist:', error);
//     res.status(500).json({ message: 'Error adding item to wishlist' });
//   }
// });

// Route to add an item to a user's wishlist
router.post('/add', async (req, res) => {
    try {
      const { userId } = req.body;
  
      const existingProfile = await UserProfile.findOne({
        where: { userId }
      });
  
      if (existingProfile) {
        console.error('User alreaady exists')
        res.status(400).json({ message: 'User alreaady exists' });
        return;
      }

      while(true){
        var randomString = generateRandomString(10);
        console.log(randomString);
  
        const existingName = await UserProfile.findOne({
            where: { displayName: randomString }
        });
  
        if(!existingName){
            break;
        }
      }
  
      const newUser = await UserProfile.create({ userId, displayName: randomString, description: null, imageName: null });
      res.status(201).json({ message: 'User profile created successfully!' });
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
      res.status(500).json({ message: 'Error creating user profile :(' });
    }
});

router.put('/displayName', async (req, res) => {
    try {
        const { userId, displayName } = req.body;
        console.log(req.body);
        const existingProfile = await UserProfile.findOne({
            where: { userId }
        });

        if(existingProfile){
            existingProfile.displayName = displayName;
            await existingProfile.save();
        }
        res.json({ message: 'Name updated successfully!' });
    } catch (error) {
        console.error('Error updating user display name:', error);
        res.status(500).json({ message: 'Error updating user display name' });
    }
});

router.put('/description', async (req, res) => {
    try {
        const { userId, description } = req.body;
        console.log(req.body);
        const existingProfile = await UserProfile.findOne({
            where: { userId }
        });

        if(existingProfile){
            existingProfile.description = description;
            await existingProfile.save();
        }
        res.json({ message: 'Description updated successfully!' });
    } catch (error) {
        console.error('Error updating user description:', error);
        res.status(500).json({ message: 'Error updating user description' });
    }
});

router.put('/imageName', async (req, res) => {
  try {
      const { userId, imageName } = req.body;
      console.log(req.body);
      const existingProfile = await UserProfile.findOne({
          where: { userId }
      });

      if(existingProfile){
          existingProfile.imageName = imageName;
          await existingProfile.save();
      }
      res.json({ message: 'Image updated successfully!' });
  } catch (error) {
      console.error('Error updating user image:', error);
      res.status(500).json({ message: 'Error updating user image' });
  }
});

const uploadDirectory = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, req.body.userId + path.extname(file.originalname));//Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('profileImage'), (req, res) => {
    console.log("am intrat!", req.body.userId);
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send({ filename: req.file.filename, userId: req.body.userId });
});

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = router;
const express = require('express');
const router = express.Router();
const UserProfile = require('../models/userProfile.js');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');
const fs = require('fs');

// Route to search for users by display name
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;

    const users = await UserProfile.findAll({
      where: {
        displayName: {
          [Op.like]: `${query}%`
        }
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Error searching for users:', error);
    res.status(500).json({ message: 'Error searching for users' });
  }
});

// Route to get user by their Id
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const userProfile = await UserProfile.findOne({ where: { userId } });

    res.json(userProfile);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ message: 'Error getting user profile' });
  }
});

// Route to get image filename of user
router.get('/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadDirectory, filename);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(404).send('File not found.');
    }
    res.set('Content-Type', 'image');
    res.send(data);
  });
});

// Route to create Profile for a user
router.post('/add', async (req, res) => {
    try {
      const { userId } = req.body;
  
      const existingProfile = await UserProfile.findOne({
        where: { userId }
      });
  
      if (existingProfile) {
        console.error('User already exists')
        res.status(400).json({ message: 'User alreaady exists' });
        return;
      }

      while(true){
        var randomString = generateRandomString(10);
  
        const existingName = await UserProfile.findOne({
            where: { displayName: randomString }
        });
  
        if(!existingName){
            break;
        }
      }
  
      const newUser = await UserProfile.create({ userId, displayName: randomString, description: '', imageName: null, isWishlistVisible: true });
      res.status(201).json({ message: 'User profile created successfully!' });
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
      res.status(500).json({ message: 'Error creating user profile :(' });
    }
});

// Route to modify user's display name
router.put('/displayName', async (req, res) => {
    try {
        const { userId, displayName } = req.body;
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

// Route to modify user's description
router.put('/description', async (req, res) => {
    try {
        const { userId, description } = req.body;
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

// Route to modify user's image (name)
router.put('/imageName', async (req, res) => {
  try {
      const { userId, imageName } = req.body;
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

// Route to modify user's wishlist's visibility
router.put('/wishlistvisibility', async (req, res) => {
  try {
      const { userId, isWishlistVisible } = req.body;
      const existingProfile = await UserProfile.findOne({
          where: { userId }
      });

      if(existingProfile){
          existingProfile.isWishlistVisible = isWishlistVisible;
          await existingProfile.save();
      }
      res.json({ message: 'User wishlist visibility updated successfully!' });
  } catch (error) {
      console.error('Error updating user wishlist visibility:', error);
      res.status(500).json({ message: 'Error updating user wishlist visibility' });
  }
});

// Path to uploads folder, for profile images
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

// Route to upload user's image
router.post('/upload', upload.single('profileImage'), (req, res) => {
    // console.log("am intrat!", req.body.userId);
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send({ filename: req.file.filename, userId: req.body.userId });
});

// Function that generates a random string, for default display names
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
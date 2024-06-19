const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('../routers/userProfileRoutes');
const UserProfile = require('../models/userProfile');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use('/api', router);

jest.mock('../models/userProfile');

describe('User Routes', () => {
  describe('GET /search/:query', () => {
    it('should return users matching the query', async () => {
      const users = [{ displayName: 'George' }];
      UserProfile.findAll.mockResolvedValue(users);

      const res = await request(app).get('/api/search/test');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(users);
    });

    it('should handle errors', async () => {
      UserProfile.findAll.mockRejectedValue(new Error('DB error'));

      const res = await request(app).get('/api/search/test');

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Error searching for users');
    });
  });

  describe('GET /user/:userId', () => {
    it('should return the user profile', async () => {
      const user = { userId: 1, displayName: 'testUser' };
      UserProfile.findOne.mockResolvedValue(user);

      const res = await request(app).get('/api/user/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(user);
    });

    it('should handle errors', async () => {
      UserProfile.findOne.mockRejectedValue(new Error('DB error'));

      const res = await request(app).get('/api/user/1');

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Error getting user profile');
    });
  });

  describe('POST /add', () => {
    it('should create a new user profile', async () => {
      UserProfile.findOne.mockResolvedValue(null);
      UserProfile.create.mockResolvedValue({ userId: 1, displayName: 'randomString' });

      const res = await request(app)
        .post('/api/add')
        .send({ userId: 1 });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User profile created successfully!');
    });

    it('should not create a user profile if user already exists', async () => {
      UserProfile.findOne.mockResolvedValue({ userId: 1 });

      const res = await request(app)
        .post('/api/add')
        .send({ userId: 1 });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User alreaady exists');
    });

    it('should handle errors', async () => {
      UserProfile.findOne.mockRejectedValue(new Error('DB error'));

      const res = await request(app)
        .post('/api/add')
        .send({ userId: 1 });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Error creating user profile :(');
    });
  });

  describe('POST /upload', () => {
    it('should upload a user profile image', async () => {
      const res = await request(app)
        .post('/api/upload')
        .field('userId', '1')
        .attach('profileImage', path.join(__dirname, '../file.jpg'));
  
      expect(res.status).toBe(200);
      expect(res.body.filename).toBe('1.jpg');
      expect(res.body.userId).toBe('1');
    });
  
    it('should return 400 if no file is uploaded', async () => {
      const res = await request(app)
        .post('/api/upload')
        .field('userId', '1');
  
      expect(res.status).toBe(400);
      expect(res.text).toBe('No file uploaded.');
    });
  });  
});

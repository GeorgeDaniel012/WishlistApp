const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const Wishlist = require('../models/wishlist');
const { fetchGamesInfoByIds } = require('../api-calls/igdbApiRoutes');
const { fetchMovieShowInfoById } = require('../api-calls/tmdbApiRoutes');
const wishlistRoutes = require('../routers/wishlistRoutes');
const { transformJsonToJson } = require('../routers/wishlistRoutes'); // Adjust the path to your router file

const app = express();
app.use(bodyParser.json());
app.use('/api/wishlist', wishlistRoutes);

// Mock the required modules
jest.mock('../models/wishlist');
jest.mock('../api-calls/igdbApiRoutes');
jest.mock('../api-calls/tmdbApiRoutes');

describe('Wishlist Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /add', () => {
    it('should add an item to the wishlist', async () => {
      Wishlist.findOne.mockResolvedValue(null);
      Wishlist.create.mockResolvedValue({});

      const res = await request(app)
        .post('/api/wishlist/add')
        .send({ userId: '1', typeOfMedia: 'game', mediaId: '100' });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Item added to wishlist successfully');
    });

    it('should return 400 if item already exists', async () => {
      Wishlist.findOne.mockResolvedValue({});

      const res = await request(app)
        .post('/api/wishlist/add')
        .send({ userId: '1', typeOfMedia: 'game', mediaId: '100' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Item is already in the wishlist');
    });
  });

  describe('GET /:userId', () => {
    it('should get all items of a user\'s wishlist', async () => {
      // Mock data for Wishlist.findAll
      Wishlist.findAll.mockResolvedValue([
        { dataValues: { id: 1, userId: '1', typeOfMedia: 'game', mediaId: '100', status: 'planning' } },
        { dataValues: { id: 2, userId: '1', typeOfMedia: 'movie', mediaId: '200', status: 'watching' } }
      ]);
  
      // Mock data for fetchGamesInfoByIds
      fetchGamesInfoByIds.mockResolvedValue([
        { id: '100', name: 'Game 100', imageUrl: 'path/to/game.jpg', typeOfMedia: 'game' }
      ]);
  
      // Mock data for fetchMovieShowInfoById
      fetchMovieShowInfoById.mockResolvedValue({
        id: '200', title: 'Movie 200', poster_path: 'path/to/movie.jpg', typeOfMedia: 'movie'
      });
  
      const res = await request(app).get('/api/wishlist/1');
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        { name: 'Game 100', id: '100', typeOfMedia: 'game', imageUrl: 'path/to/game.jpg', status: 'planning', wishlistId: 1, statusId: 1, userId: '1' },
        { name: 'Movie 200', id: '200', typeOfMedia: 'movie', imageUrl: 'path/to/movie.jpg', status: 'watching', wishlistId: 2, statusId: 2, userId: '1' }
      ]);
    });
  });

  describe('DELETE /:userId/:id', () => {
    it('should delete an item from the wishlist', async () => {
      Wishlist.destroy.mockResolvedValue(1);

      const res = await request(app).delete('/api/wishlist/1/1');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Item deleted from wishlist successfully');
    });
  });

  describe('PUT /', () => {
    it('should update an item in the wishlist', async () => {
      const item = { id: 1, status: 'planning', save: jest.fn() };
      Wishlist.findOne.mockResolvedValue(item);

      const res = await request(app).put('/api/wishlist').send({ id: 1, status: 'completed' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Item updated successfully');
      expect(item.status).toBe('completed');
      expect(item.save).toHaveBeenCalled();
    });
  });
});

// describe('transformJsonToJson', () => {
//   it('should transform JSON correctly', async () => {
//     const mediaList = [
//       { id: 10, userId: '1', typeOfMedia: 'game', mediaId: '101', status: 'planning' },
//       { id: 20, userId: '1', typeOfMedia: 'movie', mediaId: '201', status: 'watching' }
//     ];

//     fetchGamesInfoByIds.mockResolvedValue([
//       { id: '100', name: 'Game 101', imageUrl: 'path/to/game.jpg' }
//     ]);

//     fetchMovieShowInfoById.mockResolvedValue({
//       id: '200', title: 'Movie 201', poster_path: 'path/to/movie.jpg'
//     });

//     const result = await transformJsonToJson(mediaList);

//     expect(result).toEqual([
//       { name: 'Game 101', id: '101', typeOfMedia: 'game', imageUrl: 'path/to/game.jpg', status: 'planning', wishlistId: 1, statusId: 1 },
//       { name: 'Movie 201', id: '201', typeOfMedia: 'movie', imageUrl: 'path/to/movie.jpg', status: 'watching', wishlistId: 2, statusId: 2 }
//     ]);
//   });
// });

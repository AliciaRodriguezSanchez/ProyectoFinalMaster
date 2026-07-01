const express = require('express');
const router = express.Router();
const favoriteController = require('../../controllers/favorite.controller');
const { checkToken } = require('../../middlewares/auth.middleware');

// GET /api/favorites/profile/:profileId
router.get(
  '/profile/:profileId',
  favoriteController.getFavoritesByProfileId
);



// POST /api/favorites
router.post('/', checkToken, favoriteController.addFavorite);

module.exports = router;

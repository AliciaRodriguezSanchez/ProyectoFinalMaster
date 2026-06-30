const express = require('express');
const router = express.Router();
const favoriteController = require('../../controllers/favorite.controller');

// GET /api/favorites/profile/:profileId
router.get(
  '/profile/:profileId',
  favoriteController.getFavoritesByProfileId
);



// POST /api/favorites
router.post('/', favoriteController.addFavorite);

module.exports = router;

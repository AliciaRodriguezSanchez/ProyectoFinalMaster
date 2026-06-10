const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');

// POST /api/favorites
router.post('/', favoriteController.addFavorite);

module.exports = router;
const express = require('express');
const router = express.Router();
const favoriteController = require('../../controllers/favorite.controller');
const { checkToken } = require('../../middlewares/auth.middleware');

//RUTA PARA OBTENER MIS FAVORITOS DESDE ARTICLE-DETAIL
router.get('/', checkToken, favoriteController.getMyFavorites);

// GET /api/favorites/profile/:profileId
router.get(
  '/profile/:profileId',
  favoriteController.getFavoritesByProfileId
);

// POST /api/favorites
router.post('/', checkToken, favoriteController.addFavorite);

// DELETE /api/favorites/:articulo_id
router.delete('/:articulo_id', checkToken, favoriteController.deleteFavorite);

module.exports = router;

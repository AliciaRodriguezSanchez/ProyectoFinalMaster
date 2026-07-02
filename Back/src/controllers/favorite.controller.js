const Favorite = require('../models/favorite.model');
const { ERROR_MESSAGE_TEXT } = require('../constants/error-message.text');

// POST /api/favorites AÑADIR ARTÍCULO A LISTA DE FAVORITOS
const addFavorite = async (req, res) => {
  console.log("USER DEL TOKEN:", req.user);
  console.log("BODY RECIBIDO:", req.body);
  try {

    const { articulo_id } = req.body;
    // El perfil real viene del token, así no se pueden crear favoritos para otro usuario.
    const perfil_id = req.user.id;

    // VALIDACIÓN BÁSICA
    if (!perfil_id || !articulo_id) {
      return res.status(400).json({ message: ERROR_MESSAGE_TEXT.common.requiredFields });
    }

    // CONTROLAR DUPLICADOS Y SI YA ESTÁ EN TU LISTA DE FAVORITOS
    const existing = await Favorite.checkFavorite(
      perfil_id,
      articulo_id
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: ERROR_MESSAGE_TEXT.favorite.duplicated
      });
    }

    // AGREGAR A LA LISTA DE FAVORITOS
    await Favorite.addFavorite(
      perfil_id,
      articulo_id
    );

    // RESPUESTA PARA ANGULAR
    return res.status(201).json({
      message: '¡Artículo añadido a lista de favoritos con éxito!'
    });

  } catch (error) {
    console.error('Error crítico al añadir a favoritos:', error.message);

    return res.status(500).json({
      message: ERROR_MESSAGE_TEXT.favorite.saveError
    });
  }
};

// GET /api/favorites/profile/:profileId
const getFavoritesByProfileId = async (req, res) => {
  try {
    const { profileId } = req.params;

    if (!profileId || Number.isNaN(Number(profileId))) {
      return res.status(400).json({
        message: ERROR_MESSAGE_TEXT.common.invalidProfileId
      });
    }

    const favorites =
      await Favorite.getFavoritesByProfileId(Number(profileId));

    return res.status(200).json(favorites);

  } catch (error) {
    console.error(
      'Error al obtener los favoritos del usuario:',
      error.message
    );

    return res.status(500).json({
      message: ERROR_MESSAGE_TEXT.favorite.loadError
    });
  }
};

// DELETE /api/favorites/:articulo_id ELIMINAR ARTÍCULO DE FAVORITOS
const deleteFavorite = async (req, res) => {
  try {
    const { articulo_id } = req.params;
    const perfil_id = req.user.id;

    const result = await Favorite.deleteFavorite(perfil_id, Number(articulo_id));

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No se encontró el favorito a eliminar' });
    }

    return res.status(200).json({ message: 'Eliminado de favoritos correctamente' });
  } catch (error) {
    console.error('Error crítico al eliminar de favoritos:', error.message);
    return res.status(500).json({ message: ERROR_MESSAGE_TEXT.favorite.saveError });
  }
};

// OBTENER MIS PROPIOS FAVORITOS DESDE ARTICLE-DETAIL
const getMyFavorites = async (req, res) => {
  try {
    // req.user.id viene del token (checkToken)
    const perfil_id = req.user.id;
    const favorites = await Favorite.getFavoritesByProfileId(perfil_id);
    return res.status(200).json(favorites);
  } catch (error) {
    console.error('Error al obtener mis favoritos:', error.message);
    return res.status(500).json({ message: 'Error al obtener favoritos' });
  }
};

module.exports = {
  addFavorite,
  getFavoritesByProfileId,
  deleteFavorite,
  getMyFavorites
};

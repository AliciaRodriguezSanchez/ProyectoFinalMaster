const Favorite = require('../models/favorite.model');
const { ERROR_MESSAGE_TEXT } = require('../constants/error-message.text');

// POST /api/favorites AÑADIR ARTÍCULO A LISTA DE FAVORITOS
const addFavorite = async (req, res) => {
    try {

        const { perfil_id, articulo_id } = req.body;

        // VALIDACIÓN BÁSICA
        if (!perfil_id || !articulo_id) {
            return res.status(400).json({ message: ERROR_MESSAGE_TEXT.common.requiredFields});
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

module.exports = {
  addFavorite,
  getFavoritesByProfileId
};

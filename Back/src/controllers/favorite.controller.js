const Favorite = require('../models/favorite.model');

// POST /api/favorites AÑADIR ARTÍCULO A LISTA DE FAVORITOS
const addFavorite = async (req, res) => {
    try {

        const { perfil_id, articulo_id } = req.body;

        // VALIDACIÓN BÁSICA
        if (!perfil_id || !articulo_id) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios'});
        }

        // CONTROLAR DUPLICADOS Y SI YA ESTÁ EN TU LISTA DE FAVORITOS
        const existing = await Favorite.checkFavorite(
            perfil_id,
            articulo_id
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: 'Este artículo ya se encuentra en tu lista de favoritos'
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
            message: 'Server error al guardar a favoritos'
        });
    }
};

module.exports = {
    addFavorite
};
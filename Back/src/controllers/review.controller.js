const Review = require('../models/review.model');
const { ERROR_MESSAGE_TEXT } = require('../constants/error-message.text');

//POST /api/reviews
const createReview = async(req, res) => {
    try {

        // CAMPOS DEL MODAL DE ANGULAR
        const {
            puntuacion,
            comentario,
            emisor_id,
            receptor_id,
            articulo_id
        } = req.body;

        // VALIDACIÓN DE PARÁMETROS
        if (!puntuacion || !comentario || !emisor_id || !articulo_id) {
            return res.status(400).json({
                message: ERROR_MESSAGE_TEXT.common.requiredFields
            });
        }

        const result = await Review.createReview({
            puntuacion,
            comentario,
            emisor_id,
            receptor_id,
            articulo_id
        });

        // RESPUESTA DE ÉXITO
        res.status(201).json({
            message: '¡Estrellitas registradas con éxito! Gracias por tu valoración',
            reviewId: result.insertId
        });

    } catch (error) {
        console.error('Error al crear la valoración:', error.message);
        res.status(500).json({
            message: ERROR_MESSAGE_TEXT.review.createError
        });
    }
};

module.exports = {
    createReview
};

const db = require('../config/db');

// CREAR VALORACIÓN
const createReview = async (reviewData) => {

    const {
        puntuacion,
        comentario,
        emisor_id,
        receptor_id,
        articulo_id
    } = reviewData;

    // CONSULTA SQL
    const sql = `
        INSERT INTO valoraciones (puntuacion, comentario, emisor_id, receptor_id, articulo_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    // EJECUCIÓN DE QUERY
    const [result] = await db.query(sql, [
        puntuacion,
        comentario || null,
        emisor_id,
        receptor_id,
        articulo_id
    ]);

    return result;
};

module.exports = {
    createReview
};
const db = require('../config/db');

// OBTENER TODAS LAS CATEGORÍAS
const getAllCategories = async () => {

    const [rows] = await db.query(
        'SELECT id, nombre, descripcion FROM categorias'
    );

    return rows;
};

module.exports = {
    getAllCategories
};
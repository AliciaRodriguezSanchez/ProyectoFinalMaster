const db = require('../config/db');

// OBTENER TODAS LAS CATEGORÍAS
const getAllCategories = async () => {
    const [rows] = await db.query(
        'SELECT id, nombre, descripcion, icono FROM categorias ORDER BY nombre ASC'
    );

    return rows;
};

// CREAR UNA CATEGORÍA
const createCategory = async (categoryData) => {
    const { nombre, descripcion, icono } = categoryData;

    const [result] = await db.query(
       `INSERT INTO categorias (nombre, descripcion, icono)
         VALUES (?, ?, ?)`,
        [nombre, descripcion, icono]
    );

    return result;
};

// ACTUALIZAR UNA CATEGORÍA
const updateCategory = async (id, categoryData) => {
    const { nombre, descripcion, icono } = categoryData;

    const [result] = await db.query(
        `UPDATE categorias
         SET nombre = ?, descripcion = ?, icono = ?
         WHERE id = ?`,
        [nombre, descripcion, icono, id]
    );

    return result;
};

// ELIMINAR UNA CATEGORÍA
const deleteCategory = async (id) => {
    const [result] = await db.query(
        'DELETE FROM categorias WHERE id = ?',
        [id]
    );

    return result;
};

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
};
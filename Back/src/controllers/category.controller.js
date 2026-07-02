const Category = require('../models/category.model');
const { ERROR_CODES } = require('../constants/error-codes');
const { ERROR_MESSAGE_TEXT } = require('../constants/error-message.text');

const isCategoryInUseError = (error) =>
    error.code === ERROR_CODES.rowIsReferenced ||
    error.code === ERROR_CODES.rowIsReferencedLegacy ||
    error.errno === ERROR_CODES.rowIsReferencedNumber;

// GET /api/categories
const getAllCategories = async (req, res) => {
    try {
        const rows = await Category.getAllCategories();

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener categorías:', error.message);

        res.status(500).json({
            message: ERROR_MESSAGE_TEXT.category.loadError
        });
    }
};

// POST /api/categories
const createCategory = async (req, res) => {
    try {
        const { nombre, descripcion, icono } = req.body;

        // Validamos que exista un nombre
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({
                message: ERROR_MESSAGE_TEXT.category.nameRequired
            });
        }

        const result = await Category.createCategory({
                nombre: nombre.trim(),
                descripcion: descripcion?.trim() || null,
                icono: icono?.trim() || null
        });

        res.status(201).json({
            message: 'Categoría creada correctamente',
            category: {
            id: result.insertId,
            nombre: nombre.trim(),
            descripcion: descripcion?.trim() || null,
            icono: icono?.trim() || null
            }
        });
    } catch (error) {
        console.error('Error al crear categoría:', error.message);

        // MySQL devuelve este código si intentamos repetir un valor UNIQUE
        if (error.code === ERROR_CODES.duplicateEntry) {
            return res.status(409).json({
                message: ERROR_MESSAGE_TEXT.category.duplicatedName
            });
        }

        res.status(500).json({
            message: ERROR_MESSAGE_TEXT.category.createError
        });
    }
};

// PUT /api/categories/:id
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, icono } = req.body;

        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({
                message: ERROR_MESSAGE_TEXT.category.nameRequired
            });
        }

        const result = await Category.updateCategory(id, {
                nombre: nombre.trim(),
                descripcion: descripcion?.trim() || null,
                icono: icono?.trim() || null
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: ERROR_MESSAGE_TEXT.category.notFound
            });
        }

        res.status(200).json({
            message: 'Categoría actualizada correctamente',
            category: {
            id: Number(id),
            nombre: nombre.trim(),
            descripcion: descripcion?.trim() || null,
            icono: icono?.trim() || null
            }
        });
    } catch (error) {
        console.error('Error al actualizar categoría:', error.message);

        if (error.code === ERROR_CODES.duplicateEntry) {
            return res.status(409).json({
                message: ERROR_MESSAGE_TEXT.category.duplicatedName
            });
        }

        res.status(500).json({
            message: ERROR_MESSAGE_TEXT.category.updateError
        });
    }
};

// DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Category.deleteCategory(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: ERROR_MESSAGE_TEXT.category.notFound
            });
        }

        res.status(200).json({
            message: 'Categoría eliminada correctamente'
        });
    } catch (error) {
        // Ocurre si la categoría está siendo utilizada por artículos
        if (isCategoryInUseError(error)) {
            return res.status(409).json({
                message: ERROR_MESSAGE_TEXT.category.deleteInUse
            });
        }

        console.error('Error al eliminar categoría:', error.code || error.message);

        res.status(500).json({
            message: ERROR_MESSAGE_TEXT.category.deleteError
        });
    }
};

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
};

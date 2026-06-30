const Category = require('../models/category.model');

// GET /api/categories
const getAllCategories = async (req, res) => {
    try {
        const rows = await Category.getAllCategories();

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener categorías:', error.message);

        res.status(500).json({
            message: 'Error del servidor al obtener las categorías'
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
                message: 'El nombre de la categoría es obligatorio'
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
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: 'Ya existe una categoría con ese nombre'
            });
        }

        res.status(500).json({
            message: 'Error del servidor al crear la categoría'
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
                message: 'El nombre de la categoría es obligatorio'
            });
        }

        const result = await Category.updateCategory(id, {
                nombre: nombre.trim(),
                descripcion: descripcion?.trim() || null,
                icono: icono?.trim() || null
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Categoría no encontrada'
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

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: 'Ya existe una categoría con ese nombre'
            });
        }

        res.status(500).json({
            message: 'Error del servidor al actualizar la categoría'
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
                message: 'Categoría no encontrada'
            });
        }

        res.status(200).json({
            message: 'Categoría eliminada correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar categoría:', error.message);

        // Ocurre si la categoría está siendo utilizada por artículos
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                message: 'No se puede eliminar porque la categoría está siendo utilizada'
            });
        }

        res.status(500).json({
            message: 'Error del servidor al eliminar la categoría'
        });
    }
};

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
};
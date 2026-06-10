const Category = require('../models/category.model');

// GET /api/categories
const getAllCategories = async (req, res) => {
    try {

        const rows = await Category.getAllCategories();

        res.status(200).json(rows);

    } catch (error) {
        console.error('Error al obtener categorías:', error.message);
        res.status(500).json({ message: 'Server error al obtener categorías' });
    }
};

module.exports = {
    getAllCategories
};
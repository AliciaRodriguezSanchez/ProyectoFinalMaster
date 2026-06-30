const express = require('express');
const router = express.Router();

const categoryController = require('../../controllers/category.controller');

// RUTA PARA OBTENER TODAS LAS CATEGORÍAS
router.get('/', categoryController.getAllCategories);

// Crear una categoría
router.post('/', categoryController.createCategory);

// Actualizar una categoría
router.put('/:id', categoryController.updateCategory);

// Eliminar una categoría
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/category.controller');

// RUTA PARA OBTENER TODAS LAS CATEGORÍAS
router.get('/', categoryController.getAllCategories);

module.exports = router;

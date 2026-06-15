const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article.controller');


// GET
// RUTA BASE PARA CATÁLOGO GET /api/articles
router.get('/', articleController.getAllArticles);
// RUTA PARA DETALLE ARTÍCULO POR ID GET /api/articles/:id
router.get('/:id', articleController.getArticleById);


// POST
// RUTA BASE PARA SUBIR ARTÍCULOS POST /api/articles
router.post('/', articleController.createArticle);


// put
// RUTA BASE PARA COMPRAR ARTÍCULO PUT /api/articles/:id/buy
router.put('/:id/buy', articleController.buyArticle);
// RUTA BASE PARA RESERVAR ARTÍCULO PUT /api/articles/:id/reserve
router.put('/:id/reserve', articleController.reserveArticle);

module.exports = router;


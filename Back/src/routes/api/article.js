const express = require('express');
const router = express.Router();
const articleController = require('../../controllers/article.controller');


// GET
// RUTA BASE PARA CATÁLOGO GET /api/articles
router.get('/', articleController.getAllArticles);

router.get('/stadistic', articleController.getNumberArticles);
router.get('/sold', articleController.getNumberArticlesSold);
router.get('/review', articleController.getNumberArticlesReview);

// obtener los últimos articulos publicados
router.get('/lastPublications', articleController.getLastArticles);

// obtener los articulos en promocion
router.get('/promotions', articleController.getArticlesInPromotion);


// POST
// RUTA BASE PARA SUBIR ARTÍCULOS POST /api/articles
router.post('/', articleController.createArticle);


// put
// RUTA BASE PARA COMPRAR ARTÍCULO PUT /api/articles/:id/buy
router.put('/:id/buy', articleController.buyArticle);
// RUTA BASE PARA RESERVAR ARTÍCULO PUT /api/articles/:id/reserve
router.put('/:id/reserve', articleController.reserveArticle);

// RUTA PARA DETALLE ARTÍCULO POR ID GET /api/articles/:id
router.get('/:id', articleController.getArticleById);

router.put('/:id', articleController.updateState);

module.exports = router;

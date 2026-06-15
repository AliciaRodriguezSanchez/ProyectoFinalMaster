const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

// RUTA BASE PARA VALORACIONES POST /api/reviews
router.post('/', reviewController.createReview);

module.exports = router;
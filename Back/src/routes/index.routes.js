const express = require('express');

const articleRoutes = require('./article.routes');
const categoryRoutes = require('./category.routes');
const reviewRoutes = require('./review.routes');
const favoriteRoutes = require('./favorite.routes');
const messageRoutes = require('./message.routes');
const reportRoutes = require('./report.routes');

const router = express.Router();

router.use('/articles', articleRoutes);
router.use('/categories', categoryRoutes);
router.use('/reviews', reviewRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/messages', messageRoutes);
router.use('/reports', reportRoutes);

module.exports = router;

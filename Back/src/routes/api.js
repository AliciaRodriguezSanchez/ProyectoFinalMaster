const express = require('express');

const router = express.Router();

const categoryRoutes = require('./api/category');
const articleRoutes = require('./api/article');
const reviewRoutes = require('./api/review');
const favoriteRoutes = require('./api/favorite');
const messageRoutes = require('./api/message');
const reportRoutes = require('./api/report');
const usersRoutes = require('./api/users')


router.get('/test', (req, res) => {
    res.json({ mensaje: '¡Servidor Express funcionando correctamente!' });
});

router.use('/categories', categoryRoutes);
router.use('/articles', articleRoutes);
router.use('/reviews', reviewRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/messages', messageRoutes);
router.use('/reports', reportRoutes);
router.use('/users', usersRoutes);

module.exports = router;

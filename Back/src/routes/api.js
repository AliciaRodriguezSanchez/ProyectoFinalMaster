const express = require('express');

const router = express.Router();
const { checkToken } = require("../middlewares/auth.middleware")

const categoryRoutes = require('./api/category');
const articleRoutes = require('./api/article');
const reviewRoutes = require('./api/review');
const favoriteRoutes = require('./api/favorite');
const messageRoutes = require('./api/message');
const reportRoutes = require('./api/report');
const loginRoutes = require('./api/login');


router.get('/test', (req, res) => {
    res.json({ mensaje: '¡Servidor Express funcionando correctamente!' });
});

router.use('/categories', checkToken, categoryRoutes);
router.use('/articles', articleRoutes);
router.use('/reviews', reviewRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/messages', checkToken,  messageRoutes);
router.use('/reports', checkToken, reportRoutes);
router.use('/', loginRoutes);

module.exports = router;

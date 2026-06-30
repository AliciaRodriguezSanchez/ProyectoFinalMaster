const express = require('express');

const router = express.Router();
const { checkToken } = require("../middlewares/auth.middleware")

const categoryRoutes = require('./api/category');
const articleRoutes = require('./api/article');
const reviewRoutes = require('./api/review');
const favoriteRoutes = require('./api/favorite');
const messageRoutes = require('./api/message');
const reportRoutes = require('./api/report');
const usersRoutes = require('./api/users')
const loginRoutes = require('./api/login');
const profileRoutes = require('./api/profile');


router.get('/test', (req, res) => {
    res.json({ mensaje: '¡Servidor Express funcionando correctamente!' });
});

router.use('/categories', categoryRoutes);
router.use('/articles', articleRoutes);
router.use('/reviews', reviewRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/messages',   messageRoutes);
router.use('/reports', checkToken, reportRoutes); 
router.use('/login', loginRoutes);
router.use('/users', usersRoutes);
router.use('/profile', checkToken, profileRoutes);

module.exports = router;

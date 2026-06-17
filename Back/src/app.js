const express = require('express');
const cors = require('cors');

// IMPORTAR ARCHIVO CONFIG DB.JS
require('./config/db');

// IMPORTAR RUTAS
const categoryRoutes = require('./routes/category.routes');
const articleRoutes = require('./routes/article.routes');
const reviewRoutes = require('./routes/review.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const messageRoutes = require('./routes/message.routes');
const reportRoutes = require('./routes/report.routes');

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json()); // NODE ASUME LOS JSON QUE MANDE ANGULAR

// RUTA DE PRUEBA INICIAL
app.get('/api/test', (req, res) => {
    res.json({ mensaje: '¡Servidor Express funcionando correctamente!' });
});

// CONEXIÓN DE ENDPOINTS
app.use('/api/categories', categoryRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reports', reportRoutes);

module.exports = app;

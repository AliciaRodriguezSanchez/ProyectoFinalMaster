const express = require('express');
const cors = require('cors');

const articleRoutes = require('./routes/article.routes');
const categoryRoutes = require('./routes/category.routes');
const reviewRoutes = require('./routes/review.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const messageRoutes = require('./routes/message.routes');
const reportRoutes = require('./routes/report.routes');

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json()); // NODE ASUME LOS JSON QUE MANDE ANGULAR

// RUTA DE SALUD DEL SERVIDOR
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// RUTA DE PRUEBA INICIAL
app.get('/api/test', (req, res) => {
    res.json({ mensaje: '¡Servidor Express funcionando correctamente!' });
});

// CONEXIÓN DE ENDPOINTS
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reports', reportRoutes);

// RUTA NO ENCONTRADA
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// MANEJO GENERAL DE ERRORES
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
});

module.exports = app;

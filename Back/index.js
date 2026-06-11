const express = require('express');
const cors = require('cors');
require('dotenv').config();

// IMPORTAR ARCHIVO CONFIG DB.JS
require('./src/config/db');

const app = express();

//MIDDLEWARES
app.use(cors());
app.use(express.json()); //NODE ASUME LOS JSON QUE MANDE ANGULAR

// IMPORTAR RUTAS
const categoryRoutes = require('./src/routes/category.routes');
const articleRoutes = require('./src/routes/article.routes');
const reviewRoutes = require('./src/routes/review.routes');
const favoriteRoutes = require('./src/routes/favorite.routes');
const messageRoutes = require('./src/routes/message.routes');
const reportRoutes = require('./src/routes/report.routes');

// CONEXIÓN DE ENDPOINTS
app.use('/api/categories', categoryRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reports', reportRoutes);
// RUTA DE PRUEBA INICIAL
app.get('/api/test', (req, res) => {
    res.json({ mensaje: '¡Servidor Express funcionando correctamente!' });
});

// INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});


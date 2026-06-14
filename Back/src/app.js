const express = require('express');
const cors = require('cors');

const routes = require('./routes/index.routes');

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
app.use('/api', routes);

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

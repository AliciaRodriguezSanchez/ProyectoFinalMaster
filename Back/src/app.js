// Creation and configuration of the Express APP
const express = require('express');
const cors = require('cors');
const { ERROR_MESSAGE_TEXT } = require('./constants/error-message.text');

const app = express();

app.use(express.json());
app.use(cors());

// Route configuration
app.use('/api', require('./routes/api'));

// 404 handler
app.use((req, res, next) => {
    // mensaje de que no encontró la ruta
    /*
    {  "message": "Ruta no encontrada",
        "path": "/api/articles"
    }
    */
    res.status(404).json({
        message: ERROR_MESSAGE_TEXT.common.routeNotFound,
        path: req.originalUrl
    });
});

// Error handler
app.use((err, req, res, next) => {
    //  Manejador global de errores de Express. Se ejecuta cuando alguna ruta/middleware lanza un error y no lo gestiona antes.
    
    // detecta error viene de express.json(), por ejemplo si el front manda un JSON roto
    const isInvalidJson = err instanceof SyntaxError && err.status === 400 && 'body' in err;
    const statusCode = isInvalidJson ? 400 : err.status || err.statusCode || 500;
    const message = isInvalidJson
        ? ERROR_MESSAGE_TEXT.common.invalidJson
        : err.expose
            ? err.message
            : ERROR_MESSAGE_TEXT.common.unexpectedError;

    console.error(`[${req.method}] ${req.originalUrl}`, err.stack || err.message);

    res.status(statusCode).json({ message });
});

module.exports = app;

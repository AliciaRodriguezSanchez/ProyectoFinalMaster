const express = require('express');
const profileController = require('../../controllers/profile.controller');
const { checkToken } = require('../../middlewares/auth.middleware');
const router = express.Router();

// Middleware de log para depurar
router.use((req, res, next) => {
    console.log(`[DEBUG] Petición recibida en /profile: ${req.method} ${req.originalUrl}`);
    next();
});

// 1. RUTAS PRIVADAS (Primero, con middleware)
router.get('/me', checkToken, profileController.getMe);
router.put('/me', checkToken, profileController.updateMe);
router.post('/check-password', checkToken, profileController.checkPassword);
router.patch('/password', checkToken, profileController.changePassword);

// 2. RUTA PÚBLICA (Al final, para que no interfiera con /me)
router.get('/:id', profileController.getProfileById);

module.exports = router;

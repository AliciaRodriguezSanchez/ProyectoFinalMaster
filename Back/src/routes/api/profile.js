const express = require('express');
const profileController = require('../../controllers/profile.controller');
const router = express.Router();

router.get('/me', profileController.getMe);
router.put('/me', profileController.updateMe);
router.post('/check-password', profileController.checkPassword);
router.patch('/password', profileController.changePassword);

module.exports = router;

const express = require('express');
const { register, resetPassword } = require('../../controllers/users.controller');
const router = express.Router();

router.post('/register', register);
router.patch('/reset-password', resetPassword);

module.exports = router;

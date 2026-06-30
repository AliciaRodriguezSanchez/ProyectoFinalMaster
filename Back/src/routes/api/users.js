const express = require('express');
const { register, resetPassword, getNumberUsers } = require('../../controllers/users.controller');
const router = express.Router();

router.post('/register', register);
router.patch('/reset-password', resetPassword);
router.get('/count', getNumberUsers)

module.exports = router;

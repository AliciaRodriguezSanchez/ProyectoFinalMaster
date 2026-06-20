const express = require('express');
const { create, register } = require('../../controllers/users.controller');
const router = express.Router();

// POST /api/reports
router.post('/register', register);

module.exports = router;

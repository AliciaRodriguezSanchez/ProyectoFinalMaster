const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/report.controller');

// POST /api/reports
router.post('/register', reportController.createReport);

module.exports = router;

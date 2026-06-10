const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');

// POST /api/reports
router.post('/', reportController.createReport);

module.exports = router
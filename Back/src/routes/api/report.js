const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/report.controller');

// GET /api/reports?status=pendiente G2
router.get('/', reportController.pendingReports)

// GET /api/reports/stadistics G2
router.get('/stadistics', reportController.stateStadistics);

// GET /api/reports/:id G2
router.get('/:id', reportController.reportsById)

// PUT /api/reports/:id
router.put('/:id', reportController.updateReportStatus)

// POST /api/reports
router.post('/', reportController.createReport);

module.exports = router;

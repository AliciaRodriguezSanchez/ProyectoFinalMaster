const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/report.controller');

// GET /api/reports?status=pendiente G2
router.get('/', reportController.stateReports)

router.get('/count', reportController.getNumberReports);

// GET /api/reports/stadistics G2
router.get('/stadistics', reportController.stateStadistics);

// GET /api/reports/user/:userId
router.get('/user/:userId', reportController.reportsByUser);

// GET /api/reports/:id G2
router.get('/:id', reportController.reportsById)

// PUT /api/reports/:id
router.put('/:id', reportController.updateReportStatus)

// POST /api/reports
router.post('/', reportController.createReport);



module.exports = router;

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');

// POST /api/messages
router.post('/', messageController.sendMessage);

module.exports = router;
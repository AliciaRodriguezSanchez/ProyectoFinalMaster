const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/message.controller');

// POST /api/messages
router.post('/', messageController.sendMessage);
router.get('/conversations/:userId', messageController.getConversations);
router.get('/conversation/:articleId/:userId', messageController.getConversation);

module.exports = router;

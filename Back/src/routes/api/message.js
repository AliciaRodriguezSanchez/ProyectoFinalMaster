const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/message.controller');

// POST /api/messages
router.post('/', messageController.sendMessage);
router.put('/conversations/:conversationId', messageController.changeStatus)
router.post('/report-message', messageController.sendReportMessage);
router.get('/conversations/:userId', messageController.getConversations);
router.get('/conversation-by-report/:reportId', messageController.getConversationByReport);
router.get('/conversation-by-id/:conversationId/:userId', messageController.getConversationById);
router.get('/conversation/:articleId/:userId', messageController.getConversation);

module.exports = router;

const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/message.controller');
const { checkToken } = require('../../middlewares/auth.middleware');

// POST /api/messages
router.post('/', checkToken, messageController.sendMessage);
router.put('/conversations/:conversationId', checkToken, messageController.changeStatus)
router.post('/report-message', checkToken, messageController.sendReportMessage);
router.get('/conversations/:userId', checkToken, messageController.getConversations);
router.get('/conversation-by-report/:reportId', checkToken, messageController.getConversationByReport);
router.get('/conversation-by-id/:conversationId/:userId', checkToken, messageController.getConversationById);
router.get('/conversation/:articleId/:userId', checkToken, messageController.getConversation);

module.exports = router;

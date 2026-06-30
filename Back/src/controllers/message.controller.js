const Message = require('../models/message.model');
const { ERROR_MESSAGE_TEXT } = require('../constants/error-message.text');

//POST /api/messages ENVIAR MENSAJES ENTRE USUARIOS
const sendMessage = async (req, res) => {
    try {

        // VALIDACIÓN DE CAMPOS
        const {
            texto_mensaje,
            emisor_id,
            receptor_id,
            articulo_id,
            tipo_mensaje
        } = req.body;

        // VALIDACIÓN BÁSICA
        if (!texto_mensaje?.trim() || !emisor_id || !receptor_id || !articulo_id) {
            return res.status(400).json({
                message: ERROR_MESSAGE_TEXT.common.requiredFields
            });
        }

        const senderId = Number(emisor_id);
        const receiverId = Number(receptor_id);
        const articleId = Number(articulo_id);

        if (!Number.isInteger(senderId) || !Number.isInteger(receiverId) || !Number.isInteger(articleId)) {
            return res.status(400).json({
                message: ERROR_MESSAGE_TEXT.common.invalidIdentifiers
            });
        }

        const result = await Message.sendMessage({
            texto_mensaje: texto_mensaje.trim(),
            emisor_id: senderId,
            receptor_id: receiverId,
            articulo_id: articleId,
            tipo_mensaje
        });

        if (!result) {
            return res.status(404).json({
                message: ERROR_MESSAGE_TEXT.message.articleNotFound
            });
        }

        if (result.errorCode === 'SAME_USER') {
            return res.status(400).json({
                message: ERROR_MESSAGE_TEXT.message.sameSenderReceiver
            });
        }

        if (result.errorCode === 'SELLER_REQUIRED') {
            return res.status(400).json({
                message: ERROR_MESSAGE_TEXT.message.sellerRequired
            });
        }

        res.status(201).json({
            message: '¡Mensaje enviado con éxito!',
            messageId: result.insertId,
            conversationId: result.conversationId
        });

    } catch (error) {
        console.error('Error al enviar el mensaje:', error.message);
        res.status(500).json({
            message: ERROR_MESSAGE_TEXT.message.sendError
        });
    }
};


const getConversation = async (req, res) => {
    try {
        const conversation = await Message.getConversation(req.params);

        if (!conversation) {
            return res.status(404).json({ message: ERROR_MESSAGE_TEXT.message.conversationNotFound });
        }

        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const getConversationById = async (req, res) => {
    try {
        const conversationId = Number(req.params.conversationId);
        const userId = Number(req.params.userId || req.query.userId);

        if (!Number.isInteger(conversationId) || !Number.isInteger(userId)) {
            return res.status(400).json({
                message: ERROR_MESSAGE_TEXT.common.invalidIdentifiers
            });
        }

        const conversation = await Message.getConversationById({ conversationId, userId });

        if (!conversation) {
            return res.status(404).json({ message: ERROR_MESSAGE_TEXT.message.conversationNotFound });
        }

        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getConversations = async (req, res) => {
    try {
        const userId = Number(req.params.userId || req.query.userId);

        if (!Number.isInteger(userId)) {
            return res.status(400).json({
                message: ERROR_MESSAGE_TEXT.common.invalidUserId
            });
        }

        const conversations = await Message.getConversationsByUser(userId);
        res.status(200).json(conversations);
    } catch (error) {
        console.error('Error al cargar conversaciones:', error.message);
        res.status(500).json({
            message: ERROR_MESSAGE_TEXT.message.conversationsLoadError
        });
    }
};

const getConversationByReport = async (req, res) => {
    try {
        const reportId = Number(req.params.reportId);

        if (!Number.isInteger(reportId)) {
            return res.status(400).json({
                message: ERROR_MESSAGE_TEXT.message.invalidReportId
            });
        }

        const conversation = await Message.getConversationByReport({
            reportId,
            viewer: req.user
        });

        if (!conversation) {
            return res.status(404).json({ message: ERROR_MESSAGE_TEXT.message.reportConversationNotFound });
        }

        if (conversation.errorCode === 'REPORT_ACCESS_DENIED') {
            return res.status(403).json({
                message: ERROR_MESSAGE_TEXT.message.reportConversationForbidden
            });
        }

        res.status(200).json(conversation);
    } catch (error) {
        console.error('Error al cargar conversación del reporte:', error.message);
        res.status(500).json({
            message: ERROR_MESSAGE_TEXT.message.reportConversationLoadError
        });
    }
};

const sendReportMessage = async (req, res) => {
    try {
        const { texto_mensaje, emisor_id, report_id } = req.body;

        if (!texto_mensaje?.trim() || !emisor_id || !report_id) {
            return res.status(400).json({
                message: ERROR_MESSAGE_TEXT.message.reportMessageRequiredFields
            });
        }

        const senderId = Number(emisor_id);
        const reportId = Number(report_id);

        if (!Number.isInteger(senderId) || !Number.isInteger(reportId)) {
            return res.status(400).json({
                message: ERROR_MESSAGE_TEXT.common.invalidIdentifiers
            });
        }

        const result = await Message.sendReportMessage({
            reportId,
            senderId,
            messageText: texto_mensaje,
            viewer: req.user
        });

        if (!result) {
            return res.status(404).json({
                message: ERROR_MESSAGE_TEXT.report.notFound
            });
        }

        if (result.errorCode === 'REPORT_REPLY_NOT_ALLOWED') {
            return res.status(403).json({
                message: ERROR_MESSAGE_TEXT.message.moderatorOnly
            });
        }

        if (result.errorCode === 'ADMIN_NOT_FOUND') {
            return res.status(404).json({
                message: ERROR_MESSAGE_TEXT.message.adminNotFound
            });
        }

        if (result.errorCode === 'ADMIN_READ_ONLY') {
            return res.status(403).json({
                message: ERROR_MESSAGE_TEXT.message.adminReadOnly
            });
        }

        res.status(201).json({
            message: 'Mensaje enviado al denunciante',
            messageId: result.insertId,
            receiverId: result.receiverId,
            articleId: result.articleId
        });
    } catch (error) {
        console.error('Error al enviar mensaje al denunciante:', error.message);
        res.status(500).json({
            message: ERROR_MESSAGE_TEXT.message.sendReportMessageError
        });
    }
};


const changeStatus = async (req, res) => {
  const { status } = req.body;
  const { conversationId } = req.params;

  console.log('Recibiendo PUT', { status, conversationId})

  const validStatuses = ['unreaded', 'readed', 'pending', 'resolved'];

  if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ message: ERROR_MESSAGE_TEXT.message.invalidStatus });
    }

  if (!conversationId || isNaN(Number(conversationId))) {
        return res.status(400).json({ message: ERROR_MESSAGE_TEXT.message.invalidConversationId });
    }

  const exists = await Message.existsConversationById(conversationId);
  
  if (!exists) {
        return res.status(404).json({ message: ERROR_MESSAGE_TEXT.message.conversationNotFound });
    }

  try {
    const result = await Message.editStatus(status, conversationId);
    res.status(200).json({ message: 'Status actualizado'});
  } catch (error) {
    res.status(500).json({ message: ERROR_MESSAGE_TEXT.message.statusUpdateError });
  }
};

     


    



module.exports = {
    sendMessage,
    getConversations,
    getConversation,
    getConversationById,
    getConversationByReport,
    sendReportMessage,
    changeStatus
};

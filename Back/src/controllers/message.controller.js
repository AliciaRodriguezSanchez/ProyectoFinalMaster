const Message = require('../models/message.model');

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
                message: 'Todos los campos son obligatorios'
            });
        }

        const senderId = Number(emisor_id);
        const receiverId = Number(receptor_id);
        const articleId = Number(articulo_id);

        if (!Number.isInteger(senderId) || !Number.isInteger(receiverId) || !Number.isInteger(articleId)) {
            return res.status(400).json({
                message: 'Los identificadores deben ser números válidos'
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
                message: 'Artículo no encontrado'
            });
        }

        if (result.errorCode === 'SAME_USER') {
            return res.status(400).json({
                message: 'El emisor y receptor no pueden ser el mismo usuario'
            });
        }

        if (result.errorCode === 'SELLER_REQUIRED') {
            return res.status(400).json({
                message: 'La conversación debe incluir al vendedor del artículo'
            });
        }

        // RESPUESTA DE ÉXITO
        res.status(201).json({
            message: '¡Mensaje enviado con éxito!',
            messageId: result.insertId,
            conversationId: result.conversationId
        });

    } catch (error) {
        console.error('Error al enviar el mensaje:', error.message);
        res.status(500).json({
            message: 'Error al enviar el mensaje'
        });
    }
};


const getConversation = async (req, res) => {
    try {
        const conversation = await Message.getConversation(req.params);

        if (!conversation) {
            return res.status(404).json({ message: 'Conversación no encontrada' });
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
                message: 'Los identificadores deben ser números válidos'
            });
        }

        const conversation = await Message.getConversationById({ conversationId, userId });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversación no encontrada' });
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
                message: 'El identificador del usuario debe ser un número válido'
            });
        }

        const conversations = await Message.getConversationsByUser(userId);
        res.status(200).json(conversations);
    } catch (error) {
        console.error('Error al cargar conversaciones:', error.message);
        res.status(500).json({
            message: 'Error al cargar conversaciones'
        });
    }
};

const getConversationByReport = async (req, res) => {
    try {
        const reportId = Number(req.params.reportId);

        if (!Number.isInteger(reportId)) {
            return res.status(400).json({
                message: 'El identificador del reporte debe ser un número válido'
            });
        }

        const conversation = await Message.getConversationByReport(reportId);

        if (!conversation) {
            return res.status(404).json({ message: 'Conversación no encontrada para este reporte' });
        }

        res.status(200).json(conversation);
    } catch (error) {
        console.error('Error al cargar conversación del reporte:', error.message);
        res.status(500).json({
            message: 'Error al cargar la conversación del reporte'
        });
    }
};

const sendReportMessage = async (req, res) => {
    try {
        const { texto_mensaje, emisor_id, report_id } = req.body;

        if (!texto_mensaje?.trim() || !emisor_id || !report_id) {
            return res.status(400).json({
                message: 'Texto, emisor y reporte son obligatorios'
            });
        }

        const senderId = Number(emisor_id);
        const reportId = Number(report_id);

        if (!Number.isInteger(senderId) || !Number.isInteger(reportId)) {
            return res.status(400).json({
                message: 'Los identificadores deben ser números válidos'
            });
        }

        const result = await Message.sendReportMessage({
            reportId,
            senderId,
            messageText: texto_mensaje
        });

        if (!result) {
            return res.status(404).json({
                message: 'Reporte no encontrado'
            });
        }

        if (result.errorCode === 'REPORT_PARTICIPANT_REQUIRED') {
            return res.status(403).json({
                message: 'Solo el denunciante o el equipo de moderación pueden responder a este reporte'
            });
        }

        if (result.errorCode === 'ADMIN_NOT_FOUND') {
            return res.status(404).json({
                message: 'Administrador no encontrado'
            });
        }

        if (result.errorCode === 'ADMIN_READ_ONLY') {
            return res.status(403).json({
                message: 'El administrador solo puede visualizar la conversación'
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
            message: 'Error al enviar mensaje al denunciante'
        });
    }
};

module.exports = {
    sendMessage,
    getConversations,
    getConversation,
    getConversationById,
    getConversationByReport,
    sendReportMessage
};

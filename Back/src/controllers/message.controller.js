const Message = require('../models/message.model');

//POST /api/messages ENVIAR MENSAJES ENTRE USUARIOS
const sendMessage = async (req, res) => {
    try {

        // VALIDACIÓN DE CAMPOS
        const {
            texto_mensaje,
            emisor_id,
            receptor_id,
            articulo_id
        } = req.body;

        // VALIDACIÓN BÁSICA
        if (!texto_mensaje || !emisor_id || !receptor_id || !articulo_id) {
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });
        }

        const result = await Message.sendMessage({
            texto_mensaje,
            emisor_id,
            receptor_id,
            articulo_id
        });

        // RESPUESTA DE ÉXITO
        res.status(201).json({
            message: '¡Mensaje enviado con éxito!',
            messageId: result.insertId
        });

    } catch (error) {
        console.error('Error al enviar el mensaje:', error.message);
        res.status(500).json({
            message: 'Server error al enviar el mensaje'
        });
    }
};

module.exports = {
    sendMessage
};
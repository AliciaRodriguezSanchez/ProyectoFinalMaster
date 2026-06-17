const db = require('../config/db');

// ENVIAR MENSAJE ENTRE USUARIOS
const sendMessage = async (messageData) => {

    const {
        texto_mensaje,
        emisor_id,
        receptor_id,
        articulo_id
    } = messageData;

    // CONSULTA SQL
    const sql = `
    INSERT INTO mensajes (texto_mensaje, fecha_envio, emisor_id, receptor_id, articulo_id)
    VALUES (?, NOW(), ?, ?, ?)
    `;

    // EJECUCIÓN DE QUERY CON PARÁMETROS
    const [result] = await db.query(sql, [
        texto_mensaje,
        emisor_id,
        receptor_id,
        articulo_id
    ]);

    return result;
};

module.exports = {
    sendMessage
};
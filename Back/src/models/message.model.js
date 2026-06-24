const db = require('../config/db');

// ENVIAR MENSAJE ENTRE USUARIOS
const sendMessage = async (messageData) => {
    const {
        texto_mensaje,
        emisor_id,
        receptor_id,
        articulo_id,
        tipo_mensaje = 'TEXT'
    } = messageData;

    const messageText = texto_mensaje.trim();
    const messageType = tipo_mensaje || 'TEXT';
    const senderId = Number(emisor_id);
    const receiverId = Number(receptor_id);
    const articleId = Number(articulo_id);
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [articleRows] = await connection.query(
            'SELECT perfil_id FROM articulos WHERE id = ?',
            [articleId]
        );

        if (articleRows.length === 0) {
            await connection.rollback();
            return null;
        }

        const sellerId = Number(articleRows[0].perfil_id);

        if (senderId === receiverId) {
            await connection.rollback();
            return { errorCode: 'SAME_USER' };
        }

        if (senderId !== sellerId && receiverId !== sellerId) {
            await connection.rollback();
            return { errorCode: 'SELLER_REQUIRED' };
        }

        const buyerId = senderId === sellerId ? receiverId : senderId;

        const [conversationRows] = await connection.query(
            `
            SELECT id
            FROM conversations
            WHERE item_id = ? AND buyer_id = ? AND seller_id = ?
            LIMIT 1
            `,
            [articleId, buyerId, sellerId]
        );

        let conversationId = conversationRows[0]?.id;

        if (!conversationId) {
            const [conversationResult] = await connection.query(
                `
                INSERT INTO conversations (item_id, buyer_id, seller_id, created_at, last_message_at)
                VALUES (?, ?, ?, NOW(), NOW())
                `,
                [articleId, buyerId, sellerId]
            );

            conversationId = conversationResult.insertId;
        }

        const [result] = await connection.query(
            `
            INSERT INTO mensajes
                (texto_mensaje, fecha_envio, emisor_id, receptor_id, articulo_id, conversation_id, tipo_mensaje)
            VALUES (?, NOW(), ?, ?, ?, ?, ?)
            `,
            [
                messageText,
                senderId,
                receiverId,
                articleId,
                conversationId,
                messageType
            ]
        );

        await connection.query(
            'UPDATE conversations SET last_message_at = NOW() WHERE id = ?',
            [conversationId]
        );

        await connection.commit();

        return {
            ...result,
            conversationId
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const getConversationMessages = async (conversationId) => {
    const [messages] = await db.query(
        `
        SELECT
            id,
            texto_mensaje,
            fecha_envio,
            emisor_id,
            receptor_id,
            articulo_id,
            conversation_id,
            tipo_mensaje
        FROM mensajes
        WHERE conversation_id = ?
        ORDER BY fecha_envio ASC, id ASC
        `,
        [conversationId]
    );

    return messages;
};

// LISTAR CONVERSACIONES DE UN USUARIO => page principal en listado conversation
const getConversationsByUser = async (userId) => {
    const [conversations] = await db.query(
        `
        SELECT
            c.id AS conversation_id,
            c.item_id,
            a.titulo,
            a.foto,
            a.precio,
            c.buyer_id,
            buyer.nombre AS buyer_nombre,
            buyer.apellidos AS buyer_apellidos,
            buyer.nombre_usuario AS buyer_nombre_usuario,
            c.seller_id,
            seller.nombre AS seller_nombre,
            seller.apellidos AS seller_apellidos,
            seller.nombre_usuario AS seller_nombre_usuario,
            c.last_message_at AS conversation_last_message_at,
            last_message.id AS last_message_id,
            last_message.texto_mensaje AS last_message_text,
            last_message.tipo_mensaje AS last_message_type,
            last_message.fecha_envio AS last_message_fecha_envio,
            last_message.emisor_id AS last_message_sender_id
        FROM conversations c
        INNER JOIN articulos a
            ON a.id = c.item_id
        LEFT JOIN perfiles buyer
            ON buyer.id = c.buyer_id
        LEFT JOIN perfiles seller
            ON seller.id = c.seller_id
        LEFT JOIN mensajes last_message
            ON last_message.id = (
                SELECT m.id
                FROM mensajes m
                WHERE m.conversation_id = c.id
                ORDER BY m.fecha_envio DESC, m.id DESC
                LIMIT 1
            )
        WHERE c.buyer_id = ? OR c.seller_id = ?
        ORDER BY c.last_message_at DESC
        `,
        [userId, userId]
    );

    return conversations;
};

const createConversationFromLegacyMessages = async ({ articleId, userId }) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [articleRows] = await connection.query(
            'SELECT perfil_id FROM articulos WHERE id = ?',
            [articleId]
        );

        if (articleRows.length === 0) {
            await connection.rollback();
            return null;
        }

        const sellerId = Number(articleRows[0].perfil_id);

        const [messageRows] = await connection.query(
            `
            SELECT emisor_id, receptor_id
            FROM mensajes
            WHERE articulo_id = ?
              AND (emisor_id = ? OR receptor_id = ?)
            ORDER BY fecha_envio ASC, id ASC
            LIMIT 1
            `,
            [articleId, userId, userId]
        );

        if (messageRows.length === 0) {
            await connection.rollback();
            return null;
        }

        const firstMessage = messageRows[0];
        const buyerId = Number(userId) === sellerId
            ? Number(firstMessage.emisor_id) === sellerId
                ? Number(firstMessage.receptor_id)
                : Number(firstMessage.emisor_id)
            : Number(userId);

        const [conversationRows] = await connection.query(
            `
            SELECT id
            FROM conversations
            WHERE item_id = ? AND buyer_id = ? AND seller_id = ?
            LIMIT 1
            `,
            [articleId, buyerId, sellerId]
        );

        let conversationId = conversationRows[0]?.id;

        if (!conversationId) {
            const [conversationResult] = await connection.query(
                `
                INSERT INTO conversations (item_id, buyer_id, seller_id, created_at, last_message_at)
                VALUES (?, ?, ?, NOW(), NOW())
                `,
                [articleId, buyerId, sellerId]
            );

            conversationId = conversationResult.insertId;
        }

        await connection.query(
            `
            UPDATE mensajes
            SET conversation_id = ?
            WHERE articulo_id = ?
              AND conversation_id IS NULL
              AND (
                (emisor_id = ? AND receptor_id = ?)
                OR (emisor_id = ? AND receptor_id = ?)
              )
            `,
            [conversationId, articleId, buyerId, sellerId, sellerId, buyerId]
        );

        await connection.query(
            `
            UPDATE conversations
            SET last_message_at = (
                SELECT MAX(fecha_envio)
                FROM mensajes
                WHERE conversation_id = ?
            )
            WHERE id = ?
            `,
            [conversationId, conversationId]
        );

        await connection.commit();

        return conversationId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// RECUPERAR CONVERSACIÓN DE UN USUARIO SOBRE UN ARTÍCULO
const getConversation = async ({ articleId, userId }) => {
    const sql = `
    SELECT
      c.id AS conversation_id,
      c.item_id,
      a.titulo,
      a.foto,
      a.precio,
      c.buyer_id,
      buyer.nombre AS buyer_nombre,
      buyer.apellidos AS buyer_apellidos,
      buyer.nombre_usuario AS buyer_nombre_usuario,
      c.seller_id,
      seller.nombre AS seller_nombre,
      seller.apellidos AS seller_apellidos,
      seller.nombre_usuario AS seller_nombre_usuario,
      c.last_message_at
    FROM conversations c
    INNER JOIN articulos a
      ON a.id = c.item_id
    LEFT JOIN perfiles buyer
      ON buyer.id = c.buyer_id
    LEFT JOIN perfiles seller
      ON seller.id = c.seller_id
    WHERE c.item_id = ?
      AND (c.buyer_id = ? OR c.seller_id = ?)
    ORDER BY c.last_message_at DESC
    LIMIT 1
  `;

    let [conversations] = await db.query(sql, [articleId, userId, userId]);

    if (conversations.length === 0) {
        const conversationId = await createConversationFromLegacyMessages({ articleId, userId });

        if (!conversationId) {
            return null;
        }

        [conversations] = await db.query(sql, [articleId, userId, userId]);
    }

    const conversation = conversations[0];
    const messages = await getConversationMessages(conversation.conversation_id);

    return {
        ...conversation,
        messages
    };
};

// RECUPERAR CONVERSACIÓN POR ID DE HILO
const getConversationById = async ({ conversationId, userId }) => {
    const sql = `
    SELECT
      c.id AS conversation_id,
      c.item_id,
      a.titulo,
      a.foto,
      a.precio,
      c.buyer_id,
      buyer.nombre AS buyer_nombre,
      buyer.apellidos AS buyer_apellidos,
      buyer.nombre_usuario AS buyer_nombre_usuario,
      c.seller_id,
      seller.nombre AS seller_nombre,
      seller.apellidos AS seller_apellidos,
      seller.nombre_usuario AS seller_nombre_usuario,
      c.last_message_at
    FROM conversations c
    INNER JOIN articulos a
      ON a.id = c.item_id
    LEFT JOIN perfiles buyer
      ON buyer.id = c.buyer_id
    LEFT JOIN perfiles seller
      ON seller.id = c.seller_id
    WHERE c.id = ?
      AND (c.buyer_id = ? OR c.seller_id = ?)
    LIMIT 1
  `;

    const [conversations] = await db.query(sql, [conversationId, userId, userId]);

    if (conversations.length === 0) {
        return null;
    }

    const conversation = conversations[0];
    const messages = await getConversationMessages(conversation.conversation_id);

    return {
        ...conversation,
        messages
    };
};

module.exports = {
    sendMessage,
    getConversationsByUser,
    getConversation,
    getConversationById
};

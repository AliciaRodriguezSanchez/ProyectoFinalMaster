const db = require('../config/db');

const STAFF_ROLE_IDS = [2, 3];

const getUserRole = async (userId) => {
    const [users] = await db.query(
        'SELECT rol_id FROM perfiles WHERE id = ? LIMIT 1',
        [userId]
    );

    return users[0]?.rol_id ? Number(users[0].rol_id) : null;
};

const isStaffRole = (roleId) => STAFF_ROLE_IDS.includes(Number(roleId));

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
                INSERT INTO conversations (item_id, buyer_id, seller_id, created_at, last_message_at, status)
                VALUES (?, ?, ?, NOW(), NOW(), ?)
                `,
                [articleId, buyerId, sellerId, 'unreaded']
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


        ///////////////////cambio aqui

        await connection.query(
            `UPDATE conversations 
             SET last_message_at = NOW(), 
                 status = IF(status = 'resolved', 'resolved', 'unreaded') 
             WHERE id = ?`,
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

const canViewReportConversation = ({ report, viewer }) => {
    if (!viewer?.id || !viewer?.rol_id) {
        return false;
    }

    if (isStaffRole(viewer.rol_id)) {
        return true;
    }

    return Number(viewer.id) === Number(report.denunciante_id);
};

const canReplyReportConversation = ({ report, viewer }) => {
    if (!viewer?.id || !viewer?.rol_id) {
        return false;
    }

    return Number(viewer.rol_id) === 2 && Number(viewer.id) !== Number(report.denunciante_id);
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
          AND tipo_mensaje <> 'SYSTEM'
        ORDER BY fecha_envio ASC, id ASC
        `,
            [conversationId]
        );

    return messages;
};

const getReportModerationMessages = async ({ articleId, complainantId, conversationId }) => {
    const [messages] = await db.query(
        `
        SELECT
            m.id,
            m.texto_mensaje,
            m.fecha_envio,
            m.emisor_id,
            m.receptor_id,
            m.articulo_id,
            m.conversation_id,
            m.tipo_mensaje,
            sender.rol_id AS emisor_rol_id
        FROM mensajes m
        LEFT JOIN perfiles sender
            ON sender.id = m.emisor_id
        WHERE m.articulo_id = ?
          AND (m.emisor_id = ? OR m.receptor_id = ?)
          AND (m.conversation_id = ? OR m.conversation_id IS NULL)
          AND m.tipo_mensaje = 'SYSTEM'
        ORDER BY m.fecha_envio ASC, m.id ASC
        `,
        [articleId, complainantId, complainantId, conversationId]
    );

    return messages;
};

const getFirstStaffUser = async () => {
    const [staffRows] = await db.query(
        `
        SELECT id, nombre, apellidos, nombre_usuario, rol_id
        FROM perfiles
        WHERE rol_id IN (2, 3)
        ORDER BY CASE WHEN rol_id = 2 THEN 0 ELSE 1 END, id ASC
        LIMIT 1
        `
    );

    return staffRows[0] || null;
};

const sortMessagesByDate = (messages) => {
    return messages.sort((first, second) => {
        const firstTime = new Date(first.fecha_envio).getTime();
        const secondTime = new Date(second.fecha_envio).getTime();

        if (firstTime === secondTime) {
            return first.id - second.id;
        }

        return firstTime - secondTime;
    });
};

// LISTAR CONVERSACIONES DE UN USUARIO => page principal en listado conversation
const getConversationsByUser = async (userId) => {
    const roleId = await getUserRole(userId);

    if (isStaffRole(roleId)) {
        return [];
    }

    const [conversations] = await db.query(
        `
        SELECT
            c.id AS conversation_id,
            c.item_id,
            c.status,
            a.titulo,
            a.foto,
            a.precio,
            a.estado_venta,
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
                  AND m.tipo_mensaje <> 'SYSTEM'
                ORDER BY m.fecha_envio DESC, m.id DESC
                LIMIT 1
            )
        WHERE (c.buyer_id = ? OR c.seller_id = ?)
          AND EXISTS (
              SELECT 1
              FROM mensajes normal_message
              WHERE normal_message.conversation_id = c.id
                AND normal_message.tipo_mensaje <> 'SYSTEM'
          )
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
              AND tipo_mensaje <> 'SYSTEM'
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
                INSERT INTO conversations (item_id, buyer_id, seller_id, created_at, last_message_at, status)
                VALUES (?, ?, ?, NOW(), NOW(), ?)
                `,
                [articleId, buyerId, sellerId, 'unreaded']
            );

            conversationId = conversationResult.insertId;
        }

        await connection.query(
            `
            UPDATE mensajes
            SET conversation_id = ?
            WHERE articulo_id = ?
              AND conversation_id IS NULL
              AND tipo_mensaje <> 'SYSTEM'
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
                  AND tipo_mensaje <> 'SYSTEM'
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
    const roleId = await getUserRole(userId);

    if (isStaffRole(roleId)) {
        return null;
    }

    const sql = `
    SELECT
      c.id AS conversation_id,
      c.item_id,
      c.status,
      a.titulo,
      a.foto,
      a.precio,
      a.estado_venta,
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
    const roleId = await getUserRole(userId);

    if (isStaffRole(roleId)) {
        return null;
    }

    const sql = `
    SELECT
      c.id AS conversation_id,
      c.item_id,
      c.status,
      a.titulo,
      a.foto,
      a.precio,
      a.estado_venta,
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

// RECUPERAR CONVERSACIÓN ASOCIADA A UN REPORTE
const getConversationByReport = async ({ reportId, viewer }) => {
    const [reportRows] = await db.query(
        `
        SELECT
          r.id,
          r.articulo_id,
          r.denunciante_id,
          r.denunciado_id,
          r.motivo,
          r.fecha_reporte,
          r.estado_reporte,
          a.titulo,
          a.foto,
          a.precio,
          a.estado_venta,
          reporter.nombre AS buyer_nombre,
          reporter.apellidos AS buyer_apellidos,
          reporter.nombre_usuario AS buyer_nombre_usuario
        FROM reportes r
        LEFT JOIN articulos a
          ON a.id = r.articulo_id
        LEFT JOIN perfiles reporter
          ON reporter.id = r.denunciante_id
        WHERE r.id = ?
        LIMIT 1
        `,
        [reportId]
    );

    if (reportRows.length === 0) {
        return null;
    }

    const report = reportRows[0];

    if (!canViewReportConversation({ report, viewer })) {
        return { errorCode: 'REPORT_ACCESS_DENIED' };
    }

    let staffUser = await getFirstStaffUser();
    let conversationId = 0;
    let conversationStaffId = staffUser?.id || report.denunciado_id;

    const [conversationRows] = await db.query(
        `
        SELECT c.id, c.seller_id
        FROM conversations c
        LEFT JOIN perfiles staff
          ON staff.id = c.seller_id
        WHERE c.item_id = ?
          AND c.buyer_id = ?
          AND staff.rol_id IN (2, 3)
        ORDER BY c.last_message_at DESC, c.id DESC
        LIMIT 1
        `,
        [report.articulo_id, report.denunciante_id]
    );

    if (conversationRows.length > 0) {
        conversationId = conversationRows[0]?.id || 0;
        conversationStaffId = conversationRows[0]?.seller_id || conversationStaffId;
    }

    if (conversationStaffId && Number(conversationStaffId) !== Number(staffUser?.id)) {
        const [staffRows] = await db.query(
            `
            SELECT id, nombre, apellidos, nombre_usuario, rol_id
            FROM perfiles
            WHERE id = ?
            LIMIT 1
            `,
            [conversationStaffId]
        );

        staffUser = staffRows[0] || staffUser;
    }

    const reportMessages = await getReportModerationMessages({
        articleId: report.articulo_id,
        complainantId: report.denunciante_id,
        conversationId
    });
    const initialReportMessage = {
        id: -Number(report.id),
        texto_mensaje: report.motivo,
        fecha_envio: report.fecha_reporte,
        emisor_id: report.denunciante_id,
        receptor_id: conversationStaffId,
        articulo_id: report.articulo_id,
        conversation_id: conversationId,
        tipo_mensaje: 'SYSTEM',
        emisor_rol_id: 1
    };

    return {
        conversation_id: conversationId,
        item_id: report.articulo_id,
        titulo: report.titulo || `Artículo #${report.articulo_id}`,
        foto: report.foto,
        precio: report.precio,
        buyer_id: report.denunciante_id,
        buyer_nombre: report.buyer_nombre,
        buyer_apellidos: report.buyer_apellidos,
        buyer_nombre_usuario: report.buyer_nombre_usuario,
        seller_id: conversationStaffId,
        seller_nombre: staffUser?.nombre,
        seller_apellidos: staffUser?.apellidos,
        seller_nombre_usuario: staffUser?.nombre_usuario,
        report_id: report.id,
        report_denunciante_id: report.denunciante_id,
        report_denunciado_id: report.denunciado_id,
        report_status: report.estado_reporte,
        last_message_at: report.fecha_reporte,
        messages: sortMessagesByDate([initialReportMessage, ...reportMessages])
    };
};

// ENVIAR MENSAJE SYSTEM EN HILO DE REPORTE
const sendReportMessage = async ({ reportId, senderId, messageText, viewer }) => {
    const [reportRows] = await db.query(
        `
        SELECT articulo_id, denunciante_id
        FROM reportes
        WHERE id = ?
        LIMIT 1
        `,
        [reportId]
    );

    if (reportRows.length === 0) {
        return null;
    }

    const report = reportRows[0];
    const staffUser = await getFirstStaffUser();

    if (!staffUser) {
        return { errorCode: 'ADMIN_NOT_FOUND' };
    }

    if (Number(viewer?.rol_id) === 3) {
        return { errorCode: 'ADMIN_READ_ONLY' };
    }

    if (!canReplyReportConversation({ report, viewer })) {
        return { errorCode: 'REPORT_REPLY_NOT_ALLOWED' };
    }

    const safeSenderId = Number(viewer.id);
    const receiverId = report.denunciante_id;

    const [conversationRows] = await db.query(
        `
        SELECT id
        FROM conversations
        WHERE item_id = ? AND buyer_id = ? AND seller_id = ?
        LIMIT 1
        `,
        [report.articulo_id, report.denunciante_id, safeSenderId]
    );

    let conversationId = conversationRows[0]?.id;

    if (!conversationId) {
        const [conversationResult] = await db.query(
            `
            INSERT INTO conversations (item_id, buyer_id, seller_id, created_at, last_message_at)
            VALUES (?, ?, ?, NOW(), NOW())
            `,
                [report.articulo_id, report.denunciante_id, safeSenderId]
        );

        conversationId = conversationResult.insertId;
    }

    const [result] = await db.query(
        `
        INSERT INTO mensajes
            (texto_mensaje, fecha_envio, emisor_id, receptor_id, articulo_id, conversation_id, tipo_mensaje)
        VALUES (?, NOW(), ?, ?, ?, ?, 'SYSTEM')
        `,
        [
            messageText.trim(),
            safeSenderId,
            receiverId,
            report.articulo_id,
            conversationId
        ]
    );

    await db.query(
        'UPDATE conversations SET last_message_at = NOW() WHERE id = ?',
        [conversationId]
    );

    return {
        ...result,
        receiverId,
        articleId: report.articulo_id,
        conversationId
    };
};

//cambiar status de una conversación

const editStatus = async (status, conversationId) => {
    const [result] = await db.query(`UPDATE conversations SET status = ? WHERE id = ?`,
        [status, conversationId]);
    return result;
};

const existsConversationById = async (conversationId, userId) => {
  const [rows] = await db.query(
    `
    SELECT id
    FROM conversations
    WHERE id = ?
      AND (buyer_id = ? OR seller_id = ?)
    `,
    [conversationId, userId, userId]
  );
  return rows[0];
};

module.exports = {
    sendMessage,
    getConversationsByUser,
    getConversation,
    getConversationById,
    getConversationByReport,
    sendReportMessage,
    editStatus,
    existsConversationById
};

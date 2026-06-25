const db = require('../config/db');

// GET REPORTED ID G2
//articulo, motivo, reportado por, img articulo.
const getReportsById = async (id) => {
    const [result] = await db.query(`
        SELECT a.titulo, r.motivo, p.nombre, a.foto
        FROM reportes as r 
        JOIN articulos as a ON r.articulo_id = a.id
        JOIN perfiles as p ON r.denunciante_id = p.id
        WHERE r.id = ?
        `, [parseInt(id)]);
        return result[0];
}

// GET REPORTES ESTADO G2
// NOMBRE DEL ARTICULO (TABLA ARTICULOS), MOTIVO, FECHA REPORTE Y ESTADO DE REPORTE

const getStateReports = async (estado) => {
    const queryParams = [];
    let sql = `
    SELECT
        r.id,
        a.titulo,
        p.nombre,
        r.motivo,
        r.fecha_reporte,
        r.estado_reporte,
        r.resolucion_comentario
    FROM reportes AS r
    LEFT JOIN articulos AS a ON r.articulo_id = a.id
    LEFT JOIN perfiles AS p ON r.denunciante_id = p.id
    `;

    if (estado) {
        sql += ' WHERE r.estado_reporte = ?';
        queryParams.push(estado);
    }

    sql += ' ORDER BY r.fecha_reporte DESC';

    const [result] = await db.query(sql, queryParams);
    return result;
};

const getReportsByComplainant = async (userId) => {
    const [result] = await db.query(
        `
        SELECT
            r.id,
            a.titulo,
            p.nombre,
            r.motivo,
            r.fecha_reporte,
            r.estado_reporte,
            r.resolucion_comentario
        FROM reportes AS r
        LEFT JOIN articulos AS a ON r.articulo_id = a.id
        LEFT JOIN perfiles AS p ON r.denunciante_id = p.id
        WHERE r.denunciante_id = ?
        ORDER BY r.fecha_reporte DESC
        `,
        [userId]
    );

    return result;
};

// GET ESTADISTICAS POR ESTADO G2
// ESTADO_REPORTE

const getAllStadicticsState = async () => {
    const [result] = await db.query(`
        SELECT estado_reporte AS Estado, COUNT(*) AS total_reportes
        FROM reportes 
        GROUP BY estado_reporte
        `);
    return result;
}

// UPDATE Actualizar estado del reporte G2
const updateReportState = async (id,estado_reporte,resolucion_comentariocomentario) => {
    const [result] = await db.query(`
        UPDATE reportes
        SET estado_reporte = ?, resolucion_comentario = ? 
        WHERE id = ?
        `, [estado_reporte, resolucion_comentariocomentario, parseInt(id)]);
    return result;
}

// CREAR REPORTE
const createReport = async (reportData) => {
    const {
        motivo,
        denunciante_id,
        denunciado_id,
        articulo_id
    } = reportData;

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            `
            INSERT INTO reportes 
                (motivo, fecha_reporte, estado_reporte, resolucion_comentario, denunciante_id, denunciado_id, articulo_id)
            VALUES (?, NOW(), 'Pendiente', NULL, ?, ?, ?)
            `,
            [
                motivo,
                denunciante_id,
                denunciado_id,
                articulo_id
            ]
        );

        const [adminRows] = await connection.query(
            `
            SELECT id
            FROM perfiles
            WHERE rol_id IN (2, 3)
            ORDER BY CASE WHEN rol_id = 2 THEN 0 ELSE 1 END, id ASC
            LIMIT 1
            `
        );

        if (adminRows.length > 0) {
            const adminId = adminRows[0].id;
            const messageText = `Nuevo reporte #${result.insertId}: ${motivo}`;
            const [conversationRows] = await connection.query(
                `
                SELECT id
                FROM conversations
                WHERE item_id = ? AND buyer_id = ? AND seller_id = ?
                LIMIT 1
                `,
                [articulo_id, denunciante_id, adminId]
            );

            let conversationId = conversationRows[0]?.id;

            if (!conversationId) {
                const [conversationResult] = await connection.query(
                    `
                    INSERT INTO conversations (item_id, buyer_id, seller_id, created_at, last_message_at)
                    VALUES (?, ?, ?, NOW(), NOW())
                    `,
                    [articulo_id, denunciante_id, adminId]
                );

                conversationId = conversationResult.insertId;
            }

            await connection.query(
                `
                INSERT INTO mensajes
                    (texto_mensaje, fecha_envio, emisor_id, receptor_id, articulo_id, conversation_id, tipo_mensaje)
                VALUES (?, NOW(), ?, ?, ?, ?, 'SYSTEM')
                `,
                [
                    messageText,
                    denunciante_id,
                    adminId,
                    articulo_id,
                    conversationId
                ]
            );

            await connection.query(
                'UPDATE conversations SET last_message_at = NOW() WHERE id = ?',
                [conversationId]
            );
        }

        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    createReport,
    getStateReports,
    getReportsByComplainant,
    getReportsById,
    updateReportState,
    getAllStadicticsState
};

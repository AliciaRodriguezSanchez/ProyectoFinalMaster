const db = require('../config/db');

// CREAR REPORTE
const createReport = async (reportData) => {

    const {
        motivo,
        denunciante_id,
        denunciado_id,
        articulo_id
    } = reportData;

    // CONSULTA SQL
    const sql = `
        INSERT INTO reportes 
        (motivo, fecha_reporte, estado_reporte, resolucion_comentario, denunciante_id, denunciado_id, articulo_id)
        VALUES (?, NOW(), 'Pendiente', NULL, ?, ?, ?)
    `;

    // EJECUCIÓN DE QUERY
    const [result] = await db.query(sql, [
        motivo,
        denunciante_id,
        denunciado_id,
        articulo_id
    ]);

    return result;
};

module.exports = {
    createReport
};
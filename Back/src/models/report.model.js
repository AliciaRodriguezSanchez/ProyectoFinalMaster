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
    const [result] = await db.query( `
    SELECT a.titulo,p.nombre, r.motivo, r.fecha_reporte, r.estado_reporte, r.resolucion_comentario
    FROM reportes AS r
    JOIN  articulos AS a ON r.articulo_id =  a.id
    JOIN perfiles as p ON r.denunciante_id = p.id
    WHERE r.estado_reporte = ?
    `, [estado]);
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
const updateReportState = async (id,estado,comentario) => {
    const [result] = await db.query(`
        UPDATE reportes
        SET estado_reporte = ?, resolucion_comentario = ? 
        WHERE id = ?
        `, [estado, comentario, parseInt(id)]);
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
    createReport, getStateReports, getReportsById, updateReportState, getAllStadicticsState
};
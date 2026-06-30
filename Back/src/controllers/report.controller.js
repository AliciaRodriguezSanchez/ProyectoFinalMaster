const Report = require('../models/report.model');
const { ERROR_MESSAGE_TEXT } = require('../constants/error-message.text');

// GET /api/reports?estado=pendiente G2
const stateReports = async (req, res) => {
    try{
        const state = req.query.estado?.trim() || null;
        const reports = await Report.getStateReports(state);
        res.json(reports);
    }catch (error){
        console.log("ERROR REAL:", error);
        res.status(500).json({
            message: ERROR_MESSAGE_TEXT.report.pendingLoadError
        });
    }
};

// GET /api/reports/user/:userId
const reportsByUser = async (req, res) => {
    try {
        const userId = Number(req.params.userId);

        if (!Number.isInteger(userId)) {
            return res.status(400).json({
                message: ERROR_MESSAGE_TEXT.common.invalidUserId
            });
        }

        const reports = await Report.getReportsByComplainant(userId);
        res.json(reports);
    } catch (error) {
        console.log("ERROR REAL:", error);
        res.status(500).json({
            message: ERROR_MESSAGE_TEXT.report.userReportsLoadError
        });
    }
};

// GET /api/reports/:id G2
const reportsById = async (req, res) => {
    try{
        const id = req.params.id;
        const report = await Report.getReportsById(id);
        if(!report){
            return res.status(404).json({
                message: ERROR_MESSAGE_TEXT.report.notFound
            })
        }
        res.json(report);
    }catch (error){
        console.log("ERROR REAL:", error);
        res.status(500).json({
            message: ERROR_MESSAGE_TEXT.report.loadError
        });
    }
};

// GET /api/reports/stadistics G2
const stateStadistics = async (req, res) => {
    try{
        const stadistics = await Report.getAllStadicticsState();
        res.json(stadistics);
    }catch (error){
        console.log("ERROR REAL:", error);
        res.status(500).json({
            message: ERROR_MESSAGE_TEXT.report.statsLoadError
        });   
    }
}

// PUT /api/reports/:id
const updateReportStatus = async (req, res) => {
    try{
        const id = req.params.id;
        const { estado_reporte, resolucion_comentario} = req.body;
        const report = await Report.updateReportState(id, estado_reporte, resolucion_comentario);
        res.status(200).json({
            message: `Reporte actualizado al estado ${estado_reporte}`
        })
    }catch (error){
        console.log("ERROR REAL:", error);
        res.status(500).json({
            message: ERROR_MESSAGE_TEXT.report.updateError
        });  
    }
};

// POST /api/reports REPORTAR ARTÍCULO
const createReport = async (req, res) => {
    try {

        // CAMPOS OBLIGATORIOS
        const {
            motivo,
            denunciante_id,
            denunciado_id,
            articulo_id
        } = req.body;

        // VALIDACIÓN BÁSICA
        if (!motivo || !denunciante_id || !denunciado_id || !articulo_id) {
            return res.status(400).json({
                message: ERROR_MESSAGE_TEXT.report.requiredFields
            });
        }

        const result = await Report.createReport({
            motivo,
            denunciante_id,
            denunciado_id,
            articulo_id
        });

        // RESPUESTA DE ÉXITO
        res.status(201).json({
            message: 'Report submitted successfully. Our team will review it! ⚠️',
            reportId: result.insertId
        });

    } catch (error) {
        console.error('Error al crear el reporte:', error.message);
        res.status(500).json({
            message: ERROR_MESSAGE_TEXT.report.createError
        });
    }
};

const getNumberReports = async (req, res) => {
    try{
        const reports = await Report.getReportsNumber();
        res.json(reports);
    }catch (error){
        console.log("ERROR REAL:", error);
        res.status(500).json({
            message: 'Error al cargar el número de los Reportes pendientes'
        });
    }
};

module.exports = {
    createReport,
    stateReports,
    reportsByUser,
    reportsById,
    updateReportStatus,
    stateStadistics,
    getNumberReports
};

const Report = require('../models/report.model');

// GET /api/reports?estado=pendiente G2
const stateReports = async (req, res) => {
    try{
        const state = req.query.estado;
        const reports = await Report.getStateReports(state);
        res.json(reports);
    }catch (error){
        console.log("ERROR REAL:", error);
        res.status(500).json({
            message: 'Error al cargar los Reportes pendientes'
        });
    }
};

// GET /api/reports/:id G2
const reportsById = async (req, res) => {
    try{
        const id = req.params.id;
        const report = await Report.getReportsById(id);
        if(!report){
            res.status(404).json({
                message: 'Reporte no encontrado'
            })
        }
        res.json(report);
    }catch (error){
        console.log("ERROR REAL:", error);
        res.status(500).json({
            message: 'Error al cargar el reporte'
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
            message: 'Error al cargar las estadísticas de estado'
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
            message: 'Error al actualizar el estado del reporte'
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
                message: 'Todos los campos obligatorios son necesarios para procesar la denuncia'
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
            message: 'Server error while creating report'
        });
    }
};

module.exports = {
    createReport, stateReports, reportsById, updateReportStatus, stateStadistics
};
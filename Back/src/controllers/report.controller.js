const Report = require('../models/report.model');

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
    createReport
};
export interface Report {
    id?: number;
    motivo: string;
    fecha_reporte?: string;
    estado_reporte?: string;
    resolucion_comentario?: string | null;
    denunciante_id: number;
    denunciado_id: number;
    articulo_id: number;
}
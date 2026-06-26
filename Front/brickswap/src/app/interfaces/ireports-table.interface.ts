export interface IReportsTable {
    id: number;
    articulo_id?: number;
    titulo: string;
    nombre: string;
    motivo: string;
    fecha_reporte: string;
    estado_reporte: string;
    resolucion_comentario?: string | null;
}

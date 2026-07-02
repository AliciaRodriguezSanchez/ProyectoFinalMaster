// MODELO PARA ARTÍCULOS
export interface IArticle {
    id?: number;
    titulo: string;
    descripcion: string;
    foto: string;
    precio: number;
    estado_articulo: 'Nuevo' | 'Como nuevo' | 'Buen estado' | 'Aceptable';
    estado_revision: 'Publicado' | 'Borrador';
    estado_venta: 'Disponible' | 'Reservado' | 'Vendido';
    fecha_publicacion?: string;
    perfil_id: number;
    categoria_id: number;
    categoria_nombre?: string;
    vendedor_nombre?: string;
    vendedor_apellidos?: string;
    vendedor_nickname?: string;
    in_promotion?: number | boolean;
}

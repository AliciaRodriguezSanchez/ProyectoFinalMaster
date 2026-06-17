export interface Message {
    id?: number;
    texto_mensaje: string;
    fecha_envio?: string;
    emisor_id: number;
    receptor_id: number;
    articulo_id: number;
}
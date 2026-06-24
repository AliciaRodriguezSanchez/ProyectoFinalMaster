export interface IAConversationMessage {
  id: number;
  texto_mensaje: string;
  fecha_envio: string;
  emisor_id: number;
  receptor_id: number;
  articulo_id: number;
  conversation_id: number;
}

export interface IAConversation {
  conversation_id: number;
  item_id: number;
  titulo: string;
  foto: string;
  precio: string | number;
  buyer_id: number;
  buyer_nombre?: string;
  buyer_apellidos?: string;
  buyer_nombre_usuario?: string;
  seller_id: number;
  seller_nombre?: string;
  seller_apellidos?: string;
  seller_nombre_usuario?: string;
  last_message_at: string;
  messages: IAConversationMessage[];
}

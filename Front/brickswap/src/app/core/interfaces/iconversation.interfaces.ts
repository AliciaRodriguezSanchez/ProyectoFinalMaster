export interface IAConversationMessage {
  id: number;
  texto_mensaje: string;
  tipo_mensaje?: 'TEXT' | 'PRICE_OFFER' | 'DELIVERY_METHOD' | 'SYSTEM';
  fecha_envio: string;
  emisor_id: number;
  emisor_rol_id?: number;
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
  report_id?: number;
  report_denunciante_id?: number;
  report_denunciado_id?: number;
  last_message_at: string;
  messages: IAConversationMessage[];
}

export interface IAConversationListItem {
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
  conversation_last_message_at: string;
  last_message_id?: number;
  last_message_text?: string;
  last_message_type?: 'TEXT' | 'PRICE_OFFER' | 'DELIVERY_METHOD' | 'SYSTEM';
  last_message_fecha_envio?: string;
  last_message_sender_id?: number;
  status?: 'readed' | 'unreaded' | 'pending' | 'resolved';
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom, lastValueFrom } from 'rxjs';
import { API_URL, CONVERSATION } from '../api';
import { IAConversation, IAConversationListItem } from '../../interfaces/iconversation.interfaces';
import { MessageStatus } from '../../../shared/caja-mensaje/caja-mensaje.component';

export interface SendMessageResponse {
  message: string;
  messageId: number;
  conversationId: number;
}

type UpdateStatusResponse = {
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private http: HttpClient) { }

  // POST /api/messages
  sendMessage(
    texto_mensaje: string,
    emisor_id: number,
    receptor_id: number,
    articulo_id: number,
    tipo_mensaje: 'TEXT' | 'PRICE_OFFER' | 'DELIVERY_METHOD' | 'SYSTEM' = 'TEXT'
  ): Observable<SendMessageResponse> {
    return this.http.post<SendMessageResponse>(`${API_URL}/messages`, {
      texto_mensaje,
      emisor_id,
      receptor_id,
      articulo_id,
      tipo_mensaje
    });
  }


  // gobtener hilo mensaje
  getConversation(articleId: number, userId: number): Promise<IAConversation> {
    return firstValueFrom(
      this.http.get<IAConversation>(`${API_URL}/messages/${CONVERSATION}/${articleId}/${userId}`)
    );
  }

  getConversationById(conversationId: number, userId: number): Promise<IAConversation> {
    return firstValueFrom(
      this.http.get<IAConversation>(`${API_URL}/messages/conversation-by-id/${conversationId}/${userId}`)
    );
  }

  getConversations(userId: number): Promise<IAConversationListItem[]> {
  return lastValueFrom(
    this.http.get<IAConversationListItem[]>(`${API_URL}/messages/conversations/${userId}`, {
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
    })
  );
}

  //cambiar estatus de la conversación
  changeConversationStatus(conversationID: number, status: MessageStatus): Promise<UpdateStatusResponse> {
    return lastValueFrom(this.http.put<UpdateStatusResponse>(`${API_URL}/messages/conversations/${conversationID}`, {
      status
    }))
  }
}

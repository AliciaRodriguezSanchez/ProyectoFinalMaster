import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom, lastValueFrom } from 'rxjs';
import { API_URL, CONVERSATION } from '../api';
import { MESSAGE_TYPE, MessageType } from '../../constants/message';
import { TOKEN_KEY } from '../../constants/auth';
import { IAConversation, IAConversationListItem } from '../../../interfaces/iconversation.interfaces';
import { MessageStatus } from '../../../shared/components/caja-mensaje/caja-mensaje.component';

export interface SendMessageResponse {
  message: string;
  messageId: number;
  conversationId: number;
}

type UpdateStatusResponse = {
  message: string
}

export interface SendReportMessageResponse {
  message: string;
  messageId: number;
  receiverId: number;
  articleId: number;
  conversationId: number;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private http: HttpClient) { }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem(TOKEN_KEY);

    return new HttpHeaders({
      Authorization: token || ''
    });
  }

  // POST /api/messages
  sendMessage(
    texto_mensaje: string,
    emisor_id: number,
    receptor_id: number,
    articulo_id: number,
    tipo_mensaje: MessageType = MESSAGE_TYPE.TEXT
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

  getConversationByReport(reportId: number): Promise<IAConversation> {
    return firstValueFrom(
      this.http.get<IAConversation>(
        `${API_URL}/messages/conversation-by-report/${reportId}`,
        { headers: this.authHeaders() }
      )
    );
  }

  sendReportMessage(
    texto_mensaje: string,
    emisor_id: number,
    report_id: number
  ): Observable<SendReportMessageResponse> {
    return this.http.post<SendReportMessageResponse>(
      `${API_URL}/messages/report-message`,
      {
        texto_mensaje,
        emisor_id,
        report_id
      },
      { headers: this.authHeaders() }
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

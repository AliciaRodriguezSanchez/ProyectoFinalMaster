import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { API_URL, CONVERSATION } from '../api';
import { IAConversation } from '../../interfaces/iconversation.interfaces';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private http: HttpClient) { }

  // POST /api/messages
  sendMessage(texto_mensaje: string, emisor_id: number, receptor_id: number, articulo_id: number): Observable<any> {
    return this.http.post<any>(`${API_URL}/messages`, {
      texto_mensaje,
      emisor_id,
      receptor_id,
      articulo_id
    });
  }


  // gobtener hilo mensaje
  getConversation(articleId: number, userId: number): Promise<IAConversation> {
    return firstValueFrom(
      this.http.get<IAConversation>(`${API_URL}/messages/${CONVERSATION}/${articleId}/${userId}`)
    );
  }
}

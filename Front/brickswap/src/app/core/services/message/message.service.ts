import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../api';

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
}

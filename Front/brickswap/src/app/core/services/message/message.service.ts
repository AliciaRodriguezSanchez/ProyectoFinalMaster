import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:3000/api/messages';

  constructor(private http: HttpClient) { }

  // POST /api/messages
  sendMessage(texto_mensaje: string, emisor_id: number, receptor_id: number, articulo_id: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, { 
      texto_mensaje, 
      emisor_id, 
      receptor_id, 
      articulo_id 
    });
  }
}

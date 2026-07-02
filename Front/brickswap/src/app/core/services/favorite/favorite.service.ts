import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../api';
import { TOKEN_KEY } from '../../constants/auth';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  constructor(private http: HttpClient) { }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem(TOKEN_KEY);

    return new HttpHeaders({
      Authorization: token || ''
    });
  }

  // POST /api/favorites
  addFavorite(articulo_id: number): Observable<any> {
    return this.http.post<any>(`${API_URL}/favorites`, { 
      articulo_id 
    }, {
      headers: this.authHeaders()
    });
  }

  // OBTENER FAVORITOS PARA SABER SI YA ESTÁ MARCADO
  getMyFavorites(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/favorites`, {
      headers: this.authHeaders()
    });
  }

  // DELETE /api/favorites/:articulo_id
  removeFavorite(articulo_id: number): Observable<any> {
    return this.http.delete<any>(`${API_URL}/favorites/${articulo_id}`, {
      headers: this.authHeaders()
    });
  }
}

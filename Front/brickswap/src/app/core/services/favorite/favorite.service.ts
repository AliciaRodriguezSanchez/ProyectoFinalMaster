import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../../../config/api';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  constructor(private http: HttpClient) { }

  // POST /api/favorites
  addFavorite(perfil_id: number, articulo_id: number): Observable<any> {
    return this.http.post<any>(`${API_URL}/favorites`, { 
      perfil_id, 
      articulo_id 
    });
  }
}

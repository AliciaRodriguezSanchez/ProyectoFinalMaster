import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = 'http://localhost:3000/api/favorites';

  constructor(private http: HttpClient) { }

  // POST /api/favorites
  addFavorite(perfil_id: number, articulo_id: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, { 
      perfil_id, 
      articulo_id 
    });
  }
}
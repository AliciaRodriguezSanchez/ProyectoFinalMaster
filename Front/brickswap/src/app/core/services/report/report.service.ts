import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../api';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private http: HttpClient) { }

  // POST /api/reports
  createReport(motivo: string, denunciante_id: number, denunciado_id: number, articulo_id: number): Observable<any> {
    return this.http.post<any>(`${API_URL}/reports`, { 
      motivo, 
      denunciante_id, 
      denunciado_id, 
      articulo_id 
    });
  }
}

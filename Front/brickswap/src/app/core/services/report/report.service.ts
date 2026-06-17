import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://localhost:3000/api/reports';

  constructor(private http: HttpClient) { }

  // POST /api/reports
  createReport(motivo: string, denunciante_id: number, denunciado_id: number, articulo_id: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, { 
      motivo, 
      denunciante_id, 
      denunciado_id, 
      articulo_id 
    });
  }
}

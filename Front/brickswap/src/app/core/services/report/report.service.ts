import { Injectable } from '@angular/core';
import { API_URL } from '../api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { IStat } from '../../../interfaces/istat.interface';
import { IReportsTable } from '../../../interfaces/ireports-table.interface';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';

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
  };

  // GET /api/reports/stadistics
  stateStadistics(): Promise<IStat[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `${token}`
    });
    return firstValueFrom(
      this.http.get<IStat[]>(`${API_URL}/reports/stadistics`, {headers})
    );
  }

  // GET /api/reports?status=
  stateReports(estado:string): Promise<IReportsTable[]>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `${token}`
    });
    return firstValueFrom(
      this.http.get<IReportsTable[]>(`${API_URL}/reports?estado=${estado}`, {headers})
    )
  }

  actualizarReporte(datos: {id: number, estado:string, resolucion:string}): Promise<any>{
    console.log('Paquete de datos', datos);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `${token}`
    });
    const body= {
      estado_reporte: datos.estado,
      resolucion_comentario: datos.resolucion
    };
    return firstValueFrom(
      this.http.put<any>(`${API_URL}/reports/${datos.id}`, body, {headers})
    );

  }


}

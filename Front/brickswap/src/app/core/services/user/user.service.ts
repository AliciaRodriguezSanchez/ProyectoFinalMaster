import { Injectable } from '@angular/core';
import { API_URL } from '../api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient) { }

  getNumberUsers(): Promise<any>{
    return firstValueFrom(
      this.http.get<any>(`${API_URL}/users/count`)
    )
  }
  
}

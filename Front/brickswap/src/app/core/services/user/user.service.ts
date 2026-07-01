import { Injectable } from '@angular/core';
import { API_URL } from '../api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { IUserAdmin } from '../../../interfaces/iuser-admin.interface';

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

  getUsuarios(): Promise<IUserAdmin[]>{
    return firstValueFrom(
      this.http.get<IUserAdmin[]>(`${API_URL}/users`)
    );
  }

  getStateChange(id:string): Promise<any>{
    return firstValueFrom(
      this.http.put(`${API_URL}/users/${id}/status`,{})
    );
  }

  getRolChange(id:number, newRole:string): Promise<any>{
    return firstValueFrom(
      this.http.put(`${API_URL}/users/${id}/role`, {newRole})
    );
  }
  
}

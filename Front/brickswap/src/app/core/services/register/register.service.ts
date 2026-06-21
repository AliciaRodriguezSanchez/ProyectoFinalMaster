import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../api';
import { Iuser } from '../../interfaces/iuser.interfaces';
import { lastValueFrom } from 'rxjs';
import { AuthLoginResponse } from '../../../interfaces/auth/auth-login.interface';


@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private httpClient = inject(HttpClient)
  private baseUrl = API_URL

  insertUser(usuario: Iuser) : Promise <AuthLoginResponse>{
      return lastValueFrom(this.httpClient.post<AuthLoginResponse>(`${this.baseUrl}/users/register`, usuario))
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../../../config/api';
import type { AuthLoginForm } from '../../../pages/auth/interfaces/auth-login-form.interface';

export interface AuthLoginResponse {
  message: string;
  token: string;
}

const TOKEN_KEY = 'auth_token'

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  constructor(private http: HttpClient) {}

  login(loginData: AuthLoginForm): Promise<AuthLoginResponse> {
    return firstValueFrom(
      this.http.post<AuthLoginResponse>(`${API_URL}/login`, loginData)
    );
  }

  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }


}


/////Esto es una prueba para ver que cuando te regitras te "Logas" automáticamente. No he creado los guards
///Se generan dos tokens, uno desde aqui(register.ts) y otro desde auth.ts. por lo que habría que centralizarlo.

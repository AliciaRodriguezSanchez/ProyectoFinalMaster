import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../../../config/api';
import type { AuthLoginForm } from '../../../pages/auth/interfaces/auth-login-form.interface';

export interface AuthLoginResponse {
  message: string;
  token: string;
}

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
}

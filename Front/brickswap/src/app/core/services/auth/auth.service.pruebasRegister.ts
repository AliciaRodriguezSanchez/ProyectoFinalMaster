import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../api';
import { TOKEN_KEY } from '../../constants/auth';
import type { AuthLoginForm } from '../../../interfaces/auth/auth-login-form.interface';
import type { AuthLoginResponse } from '../../../interfaces/auth/auth-login.interface';

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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../api';
import { TOKEN_KEY } from '../../constants/auth';
import { UserRole } from '../../constants/user-role';
import { decodeJwtPayload } from '../../utils/jwt';
import type { AuthLoginForm } from '../../../interfaces/auth/auth-login-form.interface';
import type { AuthLoginResponse, AuthTokenPayload } from '../../../interfaces/auth/auth-login.interface';
import type { AuthMessageResponse, AuthResetPasswordForm } from '../../../interfaces/auth/auth-reset-password-form.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(loginData: AuthLoginForm): Promise<AuthLoginResponse> {
    return firstValueFrom(
      this.http.post<AuthLoginResponse>(`${API_URL}/login`, loginData)
    );
  }

  resetPassword(resetData: AuthResetPasswordForm): Promise<AuthMessageResponse> {
    return firstValueFrom(
      this.http.patch<AuthMessageResponse>(`${API_URL}/users/reset-password`, resetData)
    );
  }

  async handleAuthSuccess(token: string): Promise<boolean> {
    this.saveToken(token);

    const payload = this.getTokenPayload(token);
    return this.navigateByRole(payload.role);
  }

  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getTokenPayload(token: string): AuthTokenPayload {
    return decodeJwtPayload<AuthTokenPayload>(token);
  }

  getCurrentUserId(): number | null {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      return null;
    }

    try {
      return this.getTokenPayload(token).userId;
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  }

  private navigateByRole(role: UserRole): Promise<boolean> {
    const routesByRole: Record<UserRole, string> = {
      [UserRole.USER]: '/catalog',
      [UserRole.MODERATOR]: '/moderador',
      [UserRole.ADMIN]: '/administration',
    };

    return this.router.navigate([routesByRole[role] || '/home']);
  }
}

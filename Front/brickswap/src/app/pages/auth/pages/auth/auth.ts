import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserRole } from '../../../../core/constants/user-role';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { decodeJwtPayload } from '../../../../core/utils/jwt';
import { AuthHero } from '../../components/auth-hero/auth-hero';
import { AuthLoginPanel } from '../../components/auth-login-panel/auth-login-panel';
import type { AuthHeroStat } from '../../interfaces/auth-hero.interface';
import type { AuthLoginForm } from '../../interfaces/auth-login-form.interface';

interface AuthTokenPayload {
  userId: number;
  role: UserRole;
}

@Component({
  selector: 'app-auth-page',
  imports: [ReactiveFormsModule, AuthHero, AuthLoginPanel],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class AuthPage {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  heroStats: AuthHeroStat[] = [
    { value: '2.4K+', label: 'Artículos' },
    { value: '800+', label: 'Usuarios' },
    { value: '98%', label: 'Satisfacción' },
  ];

  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  loginSubmitted = false;
  passwordRecoveryMode = false;
  recoverySuccessMessage = '';
  loginErrorMessage = signal('');

  showPasswordRecovery(): void {
    this.passwordRecoveryMode = true;
    this.loginSubmitted = false;
    this.recoverySuccessMessage = '';
    this.clearLoginError();
    this.loginForm.markAsUntouched();
  }

  showLogin(): void {
    this.passwordRecoveryMode = false;
    this.loginSubmitted = false;
    this.recoverySuccessMessage = '';
    this.clearLoginError();
    this.loginForm.markAsUntouched();
  }

  async submitAuthForm(): Promise<void> {
    if (this.passwordRecoveryMode) {
      await this.doResetPassword();
      return;
    }

    await this.doLogin();
  }

  async doLogin(): Promise<void> {
    this.loginSubmitted = true;
    this.clearLoginError();

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.setLoginRequiredError();
      return;
    }

    const loginData: AuthLoginForm = this.loginForm.getRawValue();

    try {
      const response = await this.authService.login(loginData);

      localStorage.setItem('token', response.token);

      const payload = this.getTokenPayload(response.token);
      await this.navigateByRole(payload.role);
    } catch (error: unknown) {
      console.error('Error al iniciar sesión:', error);
      this.setLoginCredentialsError();
    }
  }

  async doResetPassword(): Promise<void> {
    this.loginSubmitted = true;
    this.recoverySuccessMessage = '';

    const emailControl = this.loginForm.controls.email;

    if (emailControl.invalid) {
      emailControl.markAsTouched();
      return;
    }

    try {
      console.log('Recuperar contraseña BrickSwap:', emailControl.value);
      this.recoverySuccessMessage = 'Te hemos enviado las instrucciones a tu email.';
    } catch (error: unknown) {
      console.error('Error al recuperar contraseña:', error);
      alert('No se pudo enviar el email de recuperación');
    }
  }

  private clearLoginError(): void {
    this.loginErrorMessage.set('');
  }

  private setLoginRequiredError(): void {
    this.loginErrorMessage.set('Email y password son campos requeridos');
  }

  private setLoginCredentialsError(): void {
    this.loginErrorMessage.set('Email y/o Password incorrecto');
  }

  private getTokenPayload(token: string): AuthTokenPayload {
    return decodeJwtPayload<AuthTokenPayload>(token);
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

import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthHero } from '../../components/auth-hero/auth-hero';
import { AuthLoginPanel } from '../../components/auth-login-panel/auth-login-panel';
import type { AuthHeroStat } from '../../interfaces/auth-hero.interface';
import type { AuthLoginForm } from '../../interfaces/auth-login-form.interface';

@Component({
  selector: 'app-auth-page',
  imports: [ReactiveFormsModule, AuthHero, AuthLoginPanel],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class AuthPage {
  constructor(private router: Router) {}

  heroStats: AuthHeroStat[] = [
    { value: '2.4K+', label: 'Artículos' },
    { value: '800+', label: 'Usuarios' },
    { value: '98%', label: 'Satisfacción' },
  ];

  loginForm = new FormGroup({
    username: new FormControl('', {
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

  showPasswordRecovery(): void {
    this.passwordRecoveryMode = true;
    this.loginSubmitted = false;
    this.recoverySuccessMessage = '';
    this.loginForm.markAsUntouched();
  }

  showLogin(): void {
    this.passwordRecoveryMode = false;
    this.loginSubmitted = false;
    this.recoverySuccessMessage = '';
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

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginData: AuthLoginForm = this.loginForm.getRawValue();

    try {
      console.log('Login BrickSwap:', loginData);

      await this.router.navigate(['/catalog']);
    } catch (error: unknown) {
      console.error('Error al iniciar sesión:', error);
      alert('No se pudo iniciar sesión');
    }
  }

  async doResetPassword(): Promise<void> {
    this.loginSubmitted = true;
    this.recoverySuccessMessage = '';

    const usernameControl = this.loginForm.controls.username;

    if (usernameControl.invalid) {
      usernameControl.markAsTouched();
      return;
    }

    try {
      console.log('Recuperar contraseña BrickSwap:', usernameControl.value);
      this.recoverySuccessMessage = 'Te hemos enviado las instrucciones a tu email.';
    } catch (error: unknown) {
      console.error('Error al recuperar contraseña:', error);
      alert('No se pudo enviar el email de recuperación');
    }
  }
}

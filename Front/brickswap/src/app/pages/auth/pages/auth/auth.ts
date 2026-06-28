import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MESSAGE_TEXT } from '../../../../core/constants/message-text';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { UiToastService } from '../../../../core/services/toast/ui-toast.service';
import { AuthHero } from '../../components/auth-hero/auth-hero';
import { AuthLoginPanel } from '../../components/auth-login-panel/auth-login-panel';
import type { AuthHeroStat } from '../../../../interfaces/auth/auth-hero.interface';
import type { AuthLoginForm } from '../../../../interfaces/auth/auth-login-form.interface';

@Component({
  selector: 'app-auth-page',
  imports: [ReactiveFormsModule, AuthHero, AuthLoginPanel],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class AuthPage {
  constructor(
    private authService: AuthService,
    private toastService: UiToastService
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
    username: new FormControl('', {
      nonNullable: true,
    }),
    newPassword: new FormControl('', {
      nonNullable: true,
    }),
    repeatPassword: new FormControl('', {
      nonNullable: true,
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
    this.configurePasswordRecoveryValidators();
    this.loginForm.markAsUntouched();
  }

  showLogin(): void {
    this.passwordRecoveryMode = false;
    this.loginSubmitted = false;
    this.recoverySuccessMessage = '';
    this.clearLoginError();
    this.configureLoginValidators();
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

    const { email, password } = this.loginForm.getRawValue();
    const loginData: AuthLoginForm = { email, password };

    try {
      const response = await this.authService.login(loginData);

      await this.authService.handleAuthSuccess(response.token);
    } catch (error: unknown) {
      console.error('Error al iniciar sesión:', error);
      this.setLoginCredentialsError();
    }
  }

  async doResetPassword(): Promise<void> {
    this.loginSubmitted = true;
    this.recoverySuccessMessage = '';

    this.clearLoginError();
    const { email, username, newPassword, repeatPassword } = this.loginForm.getRawValue();

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginErrorMessage.set(MESSAGE_TEXT.auth.resetRequiredFields);
      return;
    }

    if (newPassword !== repeatPassword) {
      this.loginErrorMessage.set(MESSAGE_TEXT.auth.resetPasswordMismatch);
      return;
    }

    try {
      await this.authService.resetPassword({
        email,
        username,
        newPassword,
        repeatPassword,
      });

      this.toastService.success(MESSAGE_TEXT.auth.resetPasswordSuccess);
      this.showLogin();
      this.loginForm.reset();
    } catch (error: unknown) {
      console.error('Error al recuperar contraseña:', error);
      this.toastService.error(MESSAGE_TEXT.auth.resetPasswordError);
      this.loginErrorMessage.set(MESSAGE_TEXT.auth.resetPasswordError);
    }
  }

  private clearLoginError(): void {
    this.loginErrorMessage.set('');
  }

  private setLoginRequiredError(): void {
    this.loginErrorMessage.set(MESSAGE_TEXT.auth.loginRequiredFields);
  }

  private setLoginCredentialsError(): void {
    this.loginErrorMessage.set(MESSAGE_TEXT.auth.loginInvalidCredentials);
  }

  private configureLoginValidators(): void {
    this.loginForm.controls.password.setValidators([Validators.required]);
    this.loginForm.controls.username.clearValidators();
    this.loginForm.controls.newPassword.clearValidators();
    this.loginForm.controls.repeatPassword.clearValidators();
    this.updatePasswordControlsValidity();
  }

  private configurePasswordRecoveryValidators(): void {
    this.loginForm.controls.password.clearValidators();
    this.loginForm.controls.username.setValidators([Validators.required]);
    this.loginForm.controls.newPassword.setValidators([
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
    ]);
    this.loginForm.controls.repeatPassword.setValidators([Validators.required]);
    this.updatePasswordControlsValidity();
  }

  private updatePasswordControlsValidity(): void {
    this.loginForm.controls.password.updateValueAndValidity();
    this.loginForm.controls.username.updateValueAndValidity();
    this.loginForm.controls.newPassword.updateValueAndValidity();
    this.loginForm.controls.repeatPassword.updateValueAndValidity();
  }

}

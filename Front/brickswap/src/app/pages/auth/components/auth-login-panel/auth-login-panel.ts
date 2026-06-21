import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { UiInputComponent } from '../../../../shared/ui/input/ui-input.component';

@Component({
  selector: 'app-auth-login-panel',
  imports: [ReactiveFormsModule, RouterLink, UiButtonComponent, UiInputComponent],
  templateUrl: './auth-login-panel.html',
  styleUrl: './auth-login-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLoginPanel {
  formGroup = input.required<FormGroup>();
  titleId = input('login-title');
  title = input.required<string>();
  subtitle = input.required<string>();
  emailLabel = input('Email');
  emailPlaceholder = input('tu@email.com');
  emailActionText = input('');
  emailActionLink = input('');
  passwordLabel = input('Contraseña');
  passwordPlaceholder = input('••••••••');
  forgotPasswordText = input('¿La olvidaste?');
  forgotPasswordLink = input('');
  submitLabel = input('Iniciar sesión');
  showSubmitArrow = input(true);
  footerText = input('¿No tienes cuenta?');
  footerLinkText = input('Regístrate gratis');
  footerLink = input('/auth/register');
  submitted = input(false);
  showPassword = input(true);
  showResetPasswordFields = input(false);
  successMessage = input('');
  errorMessage = input('');

  formSubmitted = output<void>();
  emailActionClicked = output<void>();
  forgotPasswordClicked = output<void>();
  footerClicked = output<void>();

  onSubmit(): void {
    this.formSubmitted.emit();
  }

  onEmailAction(): void {
    this.emailActionClicked.emit();
  }

  onForgotPassword(): void {
    if (!this.showPassword()) {
      return;
    }

    this.forgotPasswordClicked.emit();
  }

  onFooterClick(): void {
    this.footerClicked.emit();
  }

  showRequiredError(controlName: string): boolean {
    const control = this.formGroup().get(controlName);

    return Boolean(
      control?.hasError('required') &&
      (control.touched || this.submitted())
    );
  }
}

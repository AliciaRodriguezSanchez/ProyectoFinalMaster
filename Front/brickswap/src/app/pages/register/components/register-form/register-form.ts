import { Component, input, output } from '@angular/core';
import { UiInputComponent } from '../../../../shared/ui/input/ui-input.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UiButtonComponent } from '../../../../shared/ui/button/ui-button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule ,UiInputComponent, UiButtonComponent, RouterLink],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  formGroup = input.required<FormGroup>();
  
  titleId = input('login-title');
  title = input.required<string>();
  subtitle = input.required<string>();
  passwordLabel = input('Contraseña');
  passwordPlaceholder = input('••••••••');
  showSubmitArrow = input(true);
  footerText = input('¿Ya tienes cuenta?');
  footerLinkText = input('Inicia sesión');
  footerLink = input('/login');
  submitted = input(false);
  showPassword = input(true);
  successMessage = input('');
  

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

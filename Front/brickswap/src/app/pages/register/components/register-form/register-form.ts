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
    const groupError = controlName === 'repetPassword' && this.formGroup().hasError('passwordMismatch');

    return Boolean(
      (control?.invalid || groupError) &&
      (control?.touched || this.submitted())
    );
  }

  getErrorMessage(controlName: string): string {
    const control = this.formGroup().get(controlName);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'Este campo es obligatorio';
    }

    if (control.hasError('minlength')) {
      const requiredLength = control.getError('minlength').requiredLength;
      return `Debe tener al menos ${requiredLength} caracteres`;
    }

    if (control.hasError('maxlength')) {
      const requiredLength = control.getError('maxlength').requiredLength;
      return `No puede superar los ${requiredLength} caracteres`;
    }


    if (controlName === 'email' && control.hasError('pattern')) {
        return 'Introduce un email válido';
      }

    if (controlName === 'username' && control.hasError('pattern')) {
      return 'Solo letras, números y guion bajo, sin espacios';
    }

    if ((controlName === 'name' || controlName === 'lastname') && control.hasError('pattern')) {
      return 'Solo se permiten letras';
    }

    if (controlName === 'password' && control.hasError('pattern')) {
      return 'Debe incluir mayúscula, minúscula y un número';
    }

    if (controlName === 'repetPassword' && this.formGroup().hasError('passwordMismatch')) {
      return 'Las contraseñas no coinciden';
    }

    return '';
  }

  //ver si esta úlyima función se puede abreviar con un switch o algo

}

import { Component, inject } from '@angular/core';
import { AuthHero } from '../auth/components/auth-hero/auth-hero';
import { AuthHeroStat } from '../../interfaces/auth/auth-hero.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterForm } from './components/register-form/register-form';
import { RegisterService } from '../../core/services/register/register.service';
import { Iuser } from '../../interfaces/iuser.interfaces';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, AuthHero, RegisterForm ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerService = inject(RegisterService)
  authService = inject(AuthService)


  heroStats: AuthHeroStat[] = [
    { value: '2.4K+', label: 'Artículos' },
    { value: '800+', label: 'Usuarios' },
    { value: '98%', label: 'Satisfacción' },
  ]

   registerForm = new FormGroup({
      name: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-ZÀ-ÿñÑ\s]+$/),
        ],
      }),
      lastname: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-ZÀ-ÿñÑ\s]+$/),
        ],
      }),
      username: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z0-9_]+$/),
        ],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required, 
          Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i)],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
        ],
      }),
      repetPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    })

  submitted = false;


  async onRegisterSubmit() {
    if (this.registerForm.invalid) {
        this.registerForm.markAllAsTouched();
        return;
    }

    const registerValue: Iuser = this.registerForm.value;

    try {
        const result = await this.registerService.insertUser(registerValue);

        await this.authService.handleAuthSuccess(result.token);

    } catch (error: any) {
        console.error('Error al registrar:', error);
    }

}

}

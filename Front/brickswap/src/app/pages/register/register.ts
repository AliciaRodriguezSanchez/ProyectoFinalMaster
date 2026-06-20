import { Component, input, output } from '@angular/core';
import { AuthHero } from '../auth/components/auth-hero/auth-hero';
import { AuthHeroStat } from '../auth/interfaces/auth-hero.interface';
import { AuthLoginPanel } from '../auth/components/auth-login-panel/auth-login-panel';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthLoginForm } from '../auth/interfaces/auth-login-form.interface';
import { Router } from '@angular/router';
import { FormTemplate } from '../../shared/components/form-template/form-template';
import { RegisterForm } from './components/register-form/register-form';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, AuthHero, RegisterForm ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  constructor(private router: Router) {}

  heroStats: AuthHeroStat[] = [
    { value: '2.4K+', label: 'Artículos' },
    { value: '800+', label: 'Usuarios' },
    { value: '98%', label: 'Satisfacción' },
  ]

    registerForm = new FormGroup({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      lastname: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      username: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      repetPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      })
  });


  onRegisterSubmit() : void {
    if (this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
      return;
    }

    

    const registerValue = this.registerForm.value
    console.log(registerValue)
  }

  
}



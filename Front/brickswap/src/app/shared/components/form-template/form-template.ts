import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-template',
  imports: [],
  templateUrl: './form-template.html',
  styleUrl: './form-template.css',
})
export class FormTemplate {
  @Input() title: string = 'Form Container';
  @Input() subtitle: string = 'Por favor rellena toda la información requerida';
}

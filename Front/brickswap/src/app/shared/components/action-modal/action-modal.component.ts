import { Component, input, output, signal } from '@angular/core';

import { UiButtonComponent } from '../../ui/button/ui-button.component';
import { UiInputComponent, UiInputIcon, UiInputType } from '../../ui/input/ui-input.component';
import { UiTextareaComponent } from '../../ui/textarea/ui-textarea.component';

export type ActionModalField = 'textarea' | 'input' | 'none';

@Component({
  selector: 'app-action-modal',
  imports: [UiButtonComponent, UiInputComponent, UiTextareaComponent],
  templateUrl: './action-modal.component.html',
  styleUrl: './action-modal.component.css',
})
export class ActionModalComponent {
  title = input.required<string>();
  textareaLabel = input('');
  textareaPlaceholder = input('');
  fieldType = input<ActionModalField>('textarea');
  inputType = input<UiInputType>('text');
  inputIcon = input<UiInputIcon>('email');
  inputMin = input<string | number | null>(null);
  inputStep = input<string | number | null>(null);
  submitLabel = input.required<string>();
  cancelLabel = input('Cancelar');
  requiredError = input('Este campo es obligatorio');

  canceled = output<void>();
  submitted = output<string>();

  value = signal('');
  submittedOnce = signal(false);

  get isInvalid(): boolean {
    if (this.fieldType() === 'none') {
      return false;
    }

    return this.submittedOnce() && !this.value().trim();
  }

  onValueChange(value: string): void {
    this.value.set(value);
  }

  onCancel(): void {
    this.canceled.emit();
  }

  onSubmit(): void {
    this.submittedOnce.set(true);

    const trimmedValue = this.value().trim();

    if (this.fieldType() === 'none') {
      this.submitted.emit('');
      return;
    }

    if (!trimmedValue) {
      return;
    }

    this.submitted.emit(trimmedValue);
  }
}

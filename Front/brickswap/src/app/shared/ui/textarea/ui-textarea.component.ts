import { Component, computed, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'ui-textarea',
  templateUrl: './ui-textarea.component.html',
  styleUrl: './ui-textarea.component.scss',
})
export class UiTextareaComponent {
  label = input('');
  placeholder = input('');
  rows = input(3);
  required = input(false);
  invalid = input(false);
  errorMessage = input('');
  value = input('');
  disabledInput = input(false, { alias: 'disabled' });

  valueChange = output<string>();

  internalValue = signal('');
  disabled = signal(false);
  currentValue = computed(() => this.internalValue());
  isDisabled = computed(() => this.disabledInput() || this.disabled());

  constructor() {
    effect(() => {
      this.internalValue.set(this.value());
    });
  }

  onInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const value = textarea.value;

    this.internalValue.set(value);
    this.valueChange.emit(value);
  }
}

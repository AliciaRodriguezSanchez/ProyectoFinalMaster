import { Component, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RouterLink } from '@angular/router';

export type UiInputType = 'email' | 'password' | 'text' | 'number';
export type UiInputIcon = 'email' | 'lock' | 'profile' | 'currency';

let nextUiInputId = 0;

@Component({
  selector: 'ui-input',
  imports: [RouterLink],
  templateUrl: './ui-input.component.html',
  styleUrl: './ui-input.component.scss',
  providers: [// necesario para cuando hay un formularios 
  // Si quitas ese providers, Angular no sabe cómo meter o sacar el valor de ui-input.
  //Entonces fallaría algo como: this.form.get('email')?.value
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInputComponent),
      multi: true,
    },
  ],
})
export class UiInputComponent implements ControlValueAccessor {
  inputId = input(`ui-input-${nextUiInputId++}`);
  label = input.required<string>();
  type = input<UiInputType>('text');
  icon = input<UiInputIcon>('email');
  placeholder = input('');
  autocomplete = input('');
  actionText = input('');
  actionLink = input('');
  required = input(false);
  invalid = input(false);
  errorMessage = input('');
  min = input<string | number | null>(null);
  step = input<string | number | null>(null);

  actionClicked = output<void>();
  valueChange = output<string>();

  value = signal('');
  disabled = signal(false);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = this.type() === 'number'
      ? inputElement.value.replace(/[^\d.,]/g, '')
      : inputElement.value;

    if (value !== inputElement.value) {
      inputElement.value = value;
    }

    this.value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.type() !== 'number') {
      return;
    }

    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
    ];

    if (
      allowedKeys.includes(event.key) ||
      event.metaKey ||
      event.ctrlKey
    ) {
      return;
    }

    if (!/[\d.,]/.test(event.key)) {
      event.preventDefault();
    }
  }

  onPaste(event: ClipboardEvent): void {
    if (this.type() !== 'number') {
      return;
    }

    const pastedText = event.clipboardData?.getData('text') ?? '';

    if (/[^\d.,]/.test(pastedText)) {
      event.preventDefault();
    }
  }

  onBlur(): void {
    this.onTouched();
  }

  onActionClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.actionClicked.emit();
  }
}

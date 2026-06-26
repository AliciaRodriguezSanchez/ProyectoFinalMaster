import { Component, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RouterLink } from '@angular/router';

export type UiInputType = 'email' | 'password' | 'text';
export type UiInputIcon = 'email' | 'lock' | 'profile';

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

  actionClicked = output<void>();

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
    const value = inputElement.value;

    this.value.set(value);
    this.onChange(value);
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

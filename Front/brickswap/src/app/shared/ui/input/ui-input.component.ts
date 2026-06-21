import { ChangeDetectionStrategy, Component, forwardRef, input, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RouterLink } from '@angular/router';

export type UiInputType = 'email' | 'password' | 'text';
export type UiInputIcon = 'email' | 'lock' | 'profile';

@Component({
  selector: 'ui-input',
  imports: [RouterLink],
  templateUrl: './ui-input.component.html',
  styleUrl: './ui-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInputComponent),
      multi: true,
    },
  ],
})
export class UiInputComponent implements ControlValueAccessor {
  label = input.required<string>();
  type = input<UiInputType>('text');
  icon = input<UiInputIcon>('email');
  placeholder = input('');
  autocomplete = input('');
  actionText = input('');
  actionLink = input('');
  required = input(false);
  invalid = input(false);
  errorMessage = input('') //lo añado para que se me muestre un texto con error en el registro
  

  actionClicked = output<void>();

  value = '';
  disabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.value = inputElement.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  onActionClick(): void {
    this.actionClicked.emit();
  }
}

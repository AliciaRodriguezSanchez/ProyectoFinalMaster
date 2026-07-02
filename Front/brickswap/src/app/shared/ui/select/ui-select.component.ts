import { Component, effect, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface UiSelectOption {
  label: string;
  value: string | number;
}

let nextUiSelectId = 0;

@Component({
  selector: 'ui-select',
  templateUrl: './ui-select.component.html',
  styleUrl: './ui-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiSelectComponent),
      multi: true,
    },
  ],
})
export class UiSelectComponent implements ControlValueAccessor {
  selectId = input(`ui-select-${nextUiSelectId++}`);
  label = input.required<string>();
  placeholder = input('');
  options = input.required<UiSelectOption[]>();
  required = input(false);
  invalid = input(false);
  errorMessage = input('');
  selectedValue = input<string | number | null | undefined>(undefined);
  resetKey = input(0);
  valueChange = output<string>();

  value = signal('');
  disabled = signal(false);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      this.resetKey();
      this.options();
      const selectedValue = this.selectedValue();

      if (selectedValue !== undefined) {
        this.writeValue(selectedValue);
      }
    });
  }

  writeValue(value: string | number | null): void {
    this.value.set(this.toSelectValue(value));
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

  onSelectChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;

    this.value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  onBlur(): void {
    this.onTouched();
  }

  isSelected(optionValue: string | number): boolean {
    return this.toSelectValue(optionValue) === this.value();
  }

  private toSelectValue(value: string | number | null | undefined): string {
    return value === null || value === undefined ? '' : String(value);
  }
}

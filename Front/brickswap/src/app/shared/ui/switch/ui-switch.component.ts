import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ui-switch',
  templateUrl: './ui-switch.component.html',
  styleUrl: './ui-switch.component.css',
})
export class UiSwitchComponent {
  checked = input(false);
  disabled = input(false);
  ariaLabel = input('Cambiar estado');

  checkedChange = output<boolean>();

  onChange(event: Event): void {
    if (this.disabled()) {
      return;
    }

    const inputElement = event.target as HTMLInputElement;
    this.checkedChange.emit(inputElement.checked);
  }
}

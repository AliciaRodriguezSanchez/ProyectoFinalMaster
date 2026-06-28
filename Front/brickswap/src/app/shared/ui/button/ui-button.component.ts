import {
  Component,
  input,
  output,
} from '@angular/core';

import { ButtonSize, ButtonType, ButtonVariant } from './types';

@Component({
  selector: 'ui-button',
  templateUrl: './ui-button.component.html',
  styleUrl: './ui-button.component.scss',
})
export class UiButtonComponent {
  label = input.required<string>();

  variant = input<ButtonVariant>('primary');

  size = input<ButtonSize>('md');

  type = input<ButtonType>('button');

  disabled = input(false);

  showArrow = input(false);

  clicked = output<void>();

  onClick(): void {
    if (this.disabled()) {
      return;
    }

    this.clicked.emit();
  }
}

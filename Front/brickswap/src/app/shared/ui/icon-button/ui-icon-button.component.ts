import { Component, input, output } from '@angular/core';

export type UiIconButtonIcon = 'message' | 'flag' | 'reserve';
export type UiIconButtonVariant = 'neutral' | 'danger';

@Component({
  selector: 'ui-icon-button',
  templateUrl: './ui-icon-button.component.html',
  styleUrl: './ui-icon-button.component.css',
})
export class UiIconButtonComponent {
  label = input.required<string>();
  icon = input.required<UiIconButtonIcon>();
  variant = input<UiIconButtonVariant>('neutral');
  disabled = input(false);
  iconOnly = input(false);

  clicked = output<void>();

  onClick(): void {
    if (this.disabled()) {
      return;
    }

    this.clicked.emit();
  }
}

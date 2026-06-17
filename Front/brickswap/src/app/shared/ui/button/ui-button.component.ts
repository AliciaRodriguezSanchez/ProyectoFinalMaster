import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

export type ButtonVariant =
  | 'primary'
  | 'secondary';

export type ButtonSize =
  | 'sm'
  | 'md'
  | 'lg';

export type ButtonType =
  | 'button'
  | 'submit'
  | 'reset';

@Component({
  selector: 'ui-button',
  templateUrl: './ui-button.component.html',
  styleUrl: './ui-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

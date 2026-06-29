import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'ui-favorite-button',
  templateUrl: './ui-favorite-button.component.html',
  styleUrl: './ui-favorite-button.component.css',
})
export class UiFavoriteButtonComponent {
  label = input.required<string>();
  disabled = input(false);
  selected = input(false);

  clicked = output<void>();
  isPressed = signal(false);

  onClick(): void {
    if (this.disabled()) {
      return;
    }

    this.isPressed.set(true);
    this.clicked.emit();

    window.setTimeout(() => this.isPressed.set(false), 220);
  }
}

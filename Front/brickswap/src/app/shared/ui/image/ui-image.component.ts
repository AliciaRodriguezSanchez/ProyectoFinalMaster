import { Component, input } from '@angular/core';

export type UiImageFit = 'cover' | 'contain' | 'fill' | 'scale-down';

@Component({
  selector: 'ui-image',
  templateUrl: './ui-image.component.html',
  styleUrl: './ui-image.component.css',
})
export class UiImageComponent {
  src = input.required<string>();
  alt = input.required<string>();
  fallbackSrc = input('');
  fit = input<UiImageFit>('cover');

  onError(event: Event): void {
    const image = event.target as HTMLImageElement;

    if (this.fallbackSrc() && image.src !== this.fallbackSrc()) {
      image.src = this.fallbackSrc();
    }
  }
}

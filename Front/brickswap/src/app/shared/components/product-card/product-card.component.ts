
import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { Params, RouterLink } from '@angular/router';

@Component({
  selector: 'ui-product-card',
  imports: [DecimalPipe, NgTemplateOutlet, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiProductCardComponent {
  imageUrl = input.required<string>();
  title = input.required<string>();
  price = input.required<number>();
  location = input('');
  publishedAt = input('');
  showBadge = input(false);
  badgeText = input('Nuevo');
  detailRoute = input<unknown[] | string>('');
  queryParams = input<Params | null>(null);
  condition = input('');
  fallbackImageUrl = input('https://placehold.co/400x300?text=No+Image');

  hasMeta(): boolean {
    return Boolean(this.location() || this.publishedAt());
  }

  publishedAgo(): string {
    const publishedAt = this.publishedAt();

    if (!publishedAt) {
      return '';
    }

    const publishedDate = new Date(publishedAt);

    if (Number.isNaN(publishedDate.getTime())) {
      return publishedAt;
    }

    const today = new Date();
    const millisecondsByDay = 1000 * 60 * 60 * 24;
    const days = Math.max(
      0,
      Math.floor((today.getTime() - publishedDate.getTime()) / millisecondsByDay)
    );

    if (days === 0) {
      return 'hoy';
    }

    if (days === 1) {
      return 'hace 1 día';
    }

    if (days > 30) {
      return 'hace más de un mes';
    }

    return `hace ${days} días`;
  }

  resolvedImageUrl(): string {
    const imageUrl = this.imageUrl()?.trim();

    if (!imageUrl) {
      return this.fallbackImageUrl();
    }

    if (imageUrl.startsWith('http') || imageUrl.startsWith('/assets/')) {
      return imageUrl;
    }

    return this.fallbackImageUrl();
  }

  onImageError(event: Event): void {
    const imageElement = event.target as HTMLImageElement;
    imageElement.src = this.fallbackImageUrl();
  }
}

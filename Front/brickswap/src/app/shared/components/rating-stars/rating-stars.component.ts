import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-rating-stars',
  templateUrl: './rating-stars.component.html',
  styleUrl: './rating-stars.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiRatingStarsComponent {
  rating = input(0);
  reviewCount = input<number | null>(null);
  showValue = input(true);
  showReviewCount = input(true);
  size = input<'sm' | 'md' | 'lg'>('md');

  stars = [1, 2, 3, 4, 5];

  get ratingText(): string {
    return Number(this.rating() || 0).toFixed(1);
  }

  get reviewText(): string {
    const count = this.reviewCount();

    if (count === null) {
      return '';
    }

    return `${count} ${count === 1 ? 'reseña' : 'reseñas'}`;
  }

  isStarFilled(star: number): boolean {
    return star <= Math.round(Number(this.rating() || 0));
  }
}

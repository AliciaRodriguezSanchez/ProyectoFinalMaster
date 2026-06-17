
import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'ui-product-card',
  imports: [DecimalPipe],
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
}

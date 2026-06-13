
import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'ui-product-card',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiProductCardComponent {
  readonly imageUrl = input.required<string>();
  readonly title = input.required<string>();
  readonly price = input.required<number>();
  readonly location = input('');
  readonly publishedAt = input('');
  readonly showBadge = input(false);
  readonly badgeText = input('Nuevo');
}

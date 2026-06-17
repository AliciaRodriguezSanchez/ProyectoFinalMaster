import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-category-card',
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCategoryCardComponent {
  icon = input.required<string>();
  color = input('var(--brick-color-category-default)');
  text = input.required<string>();
}

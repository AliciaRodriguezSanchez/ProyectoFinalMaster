import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-category-card',
  standalone: true,
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCategoryCardComponent {
  readonly icon = input.required<string>();
  readonly color = input('#28aeea');
  readonly text = input.required<string>();
}

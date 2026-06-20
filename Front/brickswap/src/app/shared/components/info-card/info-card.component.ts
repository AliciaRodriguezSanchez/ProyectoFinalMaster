import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-info-card',
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiInfoCardComponent {
  icon = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
}

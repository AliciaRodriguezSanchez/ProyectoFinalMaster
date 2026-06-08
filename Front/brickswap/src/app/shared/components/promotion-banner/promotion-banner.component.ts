import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { UiButtonComponent } from '../../ui/button/ui-button.component';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [UiButtonComponent],
  templateUrl: './promotion-banner.component.html',
  styleUrl: './promotion-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionBannerComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly imageUrl = input.required<string>();
}

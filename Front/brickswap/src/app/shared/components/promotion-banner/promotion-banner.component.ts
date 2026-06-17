import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { UiButtonComponent } from '../../ui/button/ui-button.component';

@Component({
  selector: 'app-hero-banner',
  imports: [UiButtonComponent],
  templateUrl: './promotion-banner.component.html',
  styleUrl: './promotion-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionBannerComponent {
  title = input.required<string>();
  description = input.required<string>();
  imageUrl = input.required<string>();
}

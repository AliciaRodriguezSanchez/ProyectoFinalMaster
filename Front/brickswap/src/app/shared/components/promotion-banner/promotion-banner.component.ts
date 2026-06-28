import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { UiButtonComponent } from '../../ui/button/ui-button.component';

@Component({
  selector: 'app-hero-banner',
  imports: [UiButtonComponent],
  templateUrl: './promotion-banner.component.html',
  styleUrl: './promotion-banner.component.scss',
})
export class PromotionBannerComponent {
  private router = inject(Router);

  title = input.required<string>();
  description = input.required<string>();
  imageUrl = input.required<string>();

  goToCatalog(): void {
    this.router.navigate(['/catalog']);
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  UiCarrouselComponent,
  UiCarrouselItem,
} from '../shared/components/carrousel/carrousel.component';
import { UiCategoryCardComponent } from '../shared/components/category-card/category-card.component';
import { UiProductCardComponent } from '../shared/components/product-card/product-card.component';
import { PromotionBannerComponent } from '../shared/components/promotion-banner/promotion-banner.component';
import { UiButtonComponent } from '../shared/ui/button/ui-button.component';
import { UiLogoComponent } from '../shared/ui/logo/ui-logo.component';

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [
    UiButtonComponent,
    UiProductCardComponent,
    PromotionBannerComponent,
    UiCategoryCardComponent,
    UiCarrouselComponent,
    UiLogoComponent,
  ],
  templateUrl: './ playground.component.html',
  styleUrl: './playground.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundComponent {
  readonly categoryItems: UiCarrouselItem[] = [
    {
      icon: '📦',
      color: 'linear-gradient(135deg, #21c4df 0%, #3478f6 100%)',
      text: 'Piezas sueltas',
    },
    {
      icon: '🧱',
      color: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
      text: 'Sets completos',
    },
    {
      icon: '👤',
      color: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
      text: 'Minifiguras',
    },
    {
      icon: '⭐',
      color: 'linear-gradient(135deg, #facc15 0%, #f59e0b 100%)',
      text: 'Coleccionables',
    },
    {
      icon: '🚀',
      color: 'linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)',
      text: 'Espacio',
    },
  ];

  login(): void {
    console.log('Login clicked');
  }

  save(): void {
    console.log('Save clicked');
  }
}

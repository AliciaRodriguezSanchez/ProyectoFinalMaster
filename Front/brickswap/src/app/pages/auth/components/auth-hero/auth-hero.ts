import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { UiLogoComponent } from '../../../../shared/ui/logo/ui-logo.component';
import type { AuthHeroStat } from '../../interfaces/auth-hero.interface';

@Component({
  selector: 'app-auth-hero',
  imports: [UiLogoComponent],
  templateUrl: './auth-hero.html',
  styleUrl: './auth-hero.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthHero {
  ariaLabel = input('BrickSwap');
  logoText = input('BRICKSWAP');
  backgroundImage = input('/assets/auth/login-bricks.png');
  title = input.required<string>();
  highlightedTitle = input.required<string>();
  description = input.required<string>();
  stats = input<AuthHeroStat[]>([]);
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiLogoComponent } from '../../../../shared/ui/logo/ui-logo.component';
import type { AuthHeroStat } from '../../../../interfaces/auth/auth-hero.interface';
import { APP_ASSETS } from '../../../../core/constants/app-assets';

@Component({
  selector: 'app-auth-hero',
  imports: [RouterLink, UiLogoComponent],
  templateUrl: './auth-hero.html',
  styleUrl: './auth-hero.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthHero {
  ariaLabel = input('BrickSwap');
  logoText = input('BRICKSWAP');
  backgroundImage = input(APP_ASSETS.loginBricks);
  title = input.required<string>();
  highlightedTitle = input.required<string>();
  description = input.required<string>();
  stats = input<AuthHeroStat[]>([]);
}

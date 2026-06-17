import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-logo',
  templateUrl: './ui-logo.component.html',
  styleUrl: './ui-logo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiLogoComponent {
  text = input('BrickSwap');
  imageUrl = input('/assets/logo/logo.png');
}

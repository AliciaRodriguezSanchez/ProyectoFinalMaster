import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-logo',
  standalone: true,
  templateUrl: './ui-logo.component.html',
  styleUrl: './ui-logo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiLogoComponent {
  readonly text = input('BrickSwap');
  readonly imageUrl = input('/assets/logo/logo.png');
}

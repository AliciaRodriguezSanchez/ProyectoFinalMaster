import { Component, input } from '@angular/core';
import { IStat } from '../../interfaces/istat.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-panel',
  imports: [CommonModule],
  templateUrl: './card-panel.component.html',
  styleUrl: './card-panel.component.css',
})
export class CardPanelComponent {
  stat = input<IStat>();
  isActive = input<boolean>(false);
}


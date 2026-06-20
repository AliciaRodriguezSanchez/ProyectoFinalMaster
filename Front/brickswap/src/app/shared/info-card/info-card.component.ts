import { Component, input } from '@angular/core';
import { IManagementCard } from '../../interfaces/imanagement-card.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-card',
  imports: [CommonModule],
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.css',
})
export class InfoCardComponent {
  management = input<IManagementCard>(); 
}

import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { IAdminPanelCard } from '../../../interfaces/iadmin-panel-card.interface';



@Component({
  selector: 'app-admin-panel-card',
  imports: [CommonModule],
  templateUrl: './admin-panel-card.component.html',
  styleUrl: './admin-panel-card.component.css',
})
export class AdminPanelCardComponent {
  card = input.required<IAdminPanelCard>();
  isActive = input<boolean>(false);

  cardSelected = output<IAdminPanelCard>();
}
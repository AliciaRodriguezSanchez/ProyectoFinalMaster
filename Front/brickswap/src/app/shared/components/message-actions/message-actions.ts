import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type MessageAction = 'price' | 'delivery' | 'buy';

@Component({
  selector: 'app-message-actions',
  imports: [CommonModule],
  templateUrl: './message-actions.html',
  styleUrl: './message-actions.css',
})
export class MessageActionsComponent {
  @Input() showPrice = true;
  @Input() showDelivery = true;
  @Input() showBuy = true;
  @Output() actionSelected = new EventEmitter<MessageAction>();

  selectAction(action: MessageAction): void {
    this.actionSelected.emit(action);
  }
}

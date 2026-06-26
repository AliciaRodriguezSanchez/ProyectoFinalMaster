import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MESSAGE_ACTION, MessageAction } from '../../../core/constants/message';
import { MESSAGE_TEXT } from '../../../core/constants/message-text';

@Component({
  selector: 'app-message-actions',
  templateUrl: './message-actions.html',
  styleUrl: './message-actions.css',
})
export class MessageActionsComponent {
  protected readonly text = MESSAGE_TEXT.messages;
  protected readonly action = MESSAGE_ACTION;

  @Input() showPrice = true;
  @Input() showDelivery = true;
  @Input() showBuy = true;
  @Output() actionSelected = new EventEmitter<MessageAction>();

  selectAction(action: MessageAction): void {
    this.actionSelected.emit(action);
  }
}

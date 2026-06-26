import { Component, Input } from '@angular/core';
import { MESSAGE_TEXT } from '../../../core/constants/message-text';

@Component({
  selector: 'app-message-empty-state',
  templateUrl: './message-empty-state.html',
  styleUrl: './message-empty-state.css',
})
export class MessageEmptyStateComponent {
  protected readonly ariaText = MESSAGE_TEXT.messages.emptyAria;

  @Input() text = MESSAGE_TEXT.messages.emptyConversation;
}

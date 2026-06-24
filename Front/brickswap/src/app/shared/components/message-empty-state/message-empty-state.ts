import { Component, Input } from '@angular/core';
import { MESSAGE_TEXT } from '../../../core/constants/message-text';

@Component({
  selector: 'app-message-empty-state',
  standalone: false,
  templateUrl: './message-empty-state.html',
  styleUrl: './message-empty-state.css',
})
export class MessageEmptyStateComponent {
  @Input() text = MESSAGE_TEXT.messages.emptyConversation;
}

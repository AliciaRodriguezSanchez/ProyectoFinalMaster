import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MESSAGE_TEXT } from '../../../core/constants/message-text';
import { ConversationMessage } from './message-threads.interface';

@Component({
  selector: 'app-message-thread',
  imports: [DecimalPipe],
  templateUrl: './message-thread.html',
  styleUrl: './message-thread.css',
})
export class MessageThreadComponent {
  protected readonly text = MESSAGE_TEXT.messages;

  @Input() messages: ConversationMessage[] = [];
}

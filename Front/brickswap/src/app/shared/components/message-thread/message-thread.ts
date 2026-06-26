import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MESSAGE_TEXT } from '../../../core/constants/message-text';

export type ConversationMessageType = 'text' | 'priceProposal' | 'deliveryMethod';

export interface ConversationMessage {
  id: number;
  type: ConversationMessageType;
  text?: string;
  title?: string;
  amount?: number;
  time: string;
  mine: boolean;
}

@Component({
  selector: 'app-message-thread',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './message-thread.html',
  styleUrl: './message-thread.css',
})
export class MessageThreadComponent {
  protected readonly text = MESSAGE_TEXT.messages;

  @Input() messages: ConversationMessage[] = [];
}

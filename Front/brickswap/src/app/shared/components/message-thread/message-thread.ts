import { Component, Input } from '@angular/core';

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
  standalone: false,
  templateUrl: './message-thread.html',
  styleUrl: './message-thread.css',
})
export class MessageThreadComponent {
  @Input() messages: ConversationMessage[] = [];
}

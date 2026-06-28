import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MessageContact, MessageProductSummary } from './message-conversation-header.interface';

@Component({
  selector: 'app-message-conversation-header',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './message-conversation-header.html',
  styleUrl: './message-conversation-header.css',
})
export class MessageConversationHeaderComponent {
  @Input({ required: true }) contact!: MessageContact;
  @Input({ required: true }) product!: MessageProductSummary;
  @Output() back = new EventEmitter<void>();

  onBack(): void {
    this.back.emit();
  }
}

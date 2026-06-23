import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface MessageContact {
  name: string;
  initial: string;
}

export interface MessageProductSummary {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
}

@Component({
  selector: 'app-message-conversation-header',
  standalone: false,
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

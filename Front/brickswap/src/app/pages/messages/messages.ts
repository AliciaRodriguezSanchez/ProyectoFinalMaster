import { Component } from '@angular/core';
import {
  MessageAction,
} from '../../shared/components/message-actions/message-actions';
import {
  MessageContact,
  MessageProductSummary,
} from '../../shared/components/message-conversation-header/message-conversation-header';
import {
  ConversationMessage,
} from '../../shared/components/message-thread/message-thread';

@Component({
  selector: 'app-messages',
  standalone: false,
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class MessagesPage {
  contact: MessageContact = {
    name: 'Pablo Bernaldo de Quirós',
    initial: 'P',
  };

  product: MessageProductSummary = {
    id: 1,
    title: 'LEGO Star Wars 75192 Millennium Falcon UCS',
    price: 550,
    imageUrl: '/assets/logo/logo.png',
  };

  emptyText =
    'Inicia la conversación enviando un mensaje, haciendo una oferta de precio o proponiendo un método de entrega.';

  messages: ConversationMessage[] = [
    {
      id: 1,
      type: 'text',
      text: 'prueba',
      time: '18:28',
      mine: true,
    },
    {
      id: 2,
      type: 'text',
      text: 'prueba 2',
      time: '21:53',
      mine: true,
    },
    {
      id: 3,
      type: 'priceProposal',
      title: 'Propuesta de precio',
      amount: 150,
      time: '04:20',
      mine: true,
    },
    {
      id: 4,
      type: 'text',
      text: 'puedes escribirme',
      time: '04:20',
      mine: true,
    },
    {
      id: 5,
      type: 'deliveryMethod',
      title: 'Método de entrega',
      text: 'Envío por mensajería (MRW, SEUR, etc.)',
      time: '04:20',
      mine: true,
    },
  ];

  hasMessages(): boolean {
    return this.messages.length > 0;
  }

  onBack(): void {
    history.back();
  }

  onActionSelected(action: MessageAction): void {
    console.log('Accion de mensaje seleccionada:', action);
  }

  onMessageSent(message: string): void {
    this.messages = [
      ...this.messages,
      {
        id: Date.now(),
        type: 'text',
        text: message,
        time: this.getCurrentTime(),
        mine: true,
      },
    ];
  }

  private getCurrentTime(): string {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());
  }
}

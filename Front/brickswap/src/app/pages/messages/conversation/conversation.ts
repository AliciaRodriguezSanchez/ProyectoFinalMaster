import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MESSAGE_TEXT } from '../../../core/constants/message-text';
import { IAConversation } from '../../../core/interfaces/iconversation.interfaces';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MessageService } from '../../../core/services/message/message.service';
import {
  MessageAction,
} from '../../../shared/components/message-actions/message-actions';
import {
  MessageContact,
  MessageProductSummary,
} from '../../../shared/components/message-conversation-header/message-conversation-header';
import {
  ConversationMessage,
} from '../../../shared/components/message-thread/message-thread';
import { SharedMessagesComponentsModule } from '../../../shared/components/shared-messages-components.module';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [CommonModule, SharedMessagesComponentsModule],
  templateUrl: './conversation.html',
  styleUrl: './conversation.css',
})
export class ConversationPage implements OnInit {
  emptyText = MESSAGE_TEXT.messages.emptyConversation;

  contact = signal<MessageContact | null>(null);
  product = signal<MessageProductSummary | null>(null);
  messages = signal<ConversationMessage[]>([]);
  conversationId = signal(0);
  articleId = signal(0);
  currentUserId = signal(0);
  receiveId = signal(0);
  sendId = signal(0);
  isLoading = signal(false);
  hasMessages = computed(() => this.messages().length > 0);
  isReceiver = computed(() => this.currentUserId() === this.receiveId());
  isSender = computed(() => this.currentUserId() === this.sendId());
  messageReceiverId = computed(() => {
    if (this.isReceiver()) {
      return this.sendId();
    }

    if (this.isSender()) {
      return this.receiveId();
    }

    return 0;
  });

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.conversationId.set(Number(this.route.snapshot.paramMap.get('conversationId')));
    this.articleId.set(Number(this.route.snapshot.paramMap.get('articleId')));
    this.currentUserId.set(
      this.authService.getCurrentUserId() ?? Number(this.route.snapshot.paramMap.get('userId'))
    );
    this.loadConversation();
  }

  async loadConversation(): Promise<void> {
    if ((!this.conversationId() && !this.articleId()) || !this.currentUserId()) {
      return;
    }

    this.isLoading.set(true);

    try {
      const conversation = this.conversationId()
        ? await this.messageService.getConversationById(this.conversationId(), this.currentUserId())
        : await this.messageService.getConversation(this.articleId(), this.currentUserId());
      this.setConversation(conversation);
    } catch (error) {
      console.error('Error al cargar la conversacion:', error);
      this.messages.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  onBack(): void {
    history.back();
  }

  onActionSelected(action: MessageAction): void {
    if (action === 'price') {
      this.sendPriceOffer();
      return;
    }

    if (action === 'delivery') {
      this.sendDeliveryMethod();
      return;
    }

    console.log('Accion de mensaje seleccionada:', action);
  }

  onMessageSent(message: string): void {
    const senderId = this.currentUserId();

    const receiverId = this.messageReceiverId();
    const articleId = this.articleId();

    if (!senderId || !receiverId || !articleId) {
      return;
    }

    this.messageService
      .sendMessage(message, senderId, receiverId, articleId)
      .subscribe({
        next: () => {
          this.messages.update((messages) => [
            ...messages,
            {
              id: Date.now(),
              type: 'text',
              text: message,
              time: this.getCurrentTime(),
              mine: true,
            },
          ]);
        },
        error: (error) => console.error('Error al enviar mensaje:', error),
      });
  }

  private sendPriceOffer(): void {
    const offer = prompt('Introduce tu propuesta de precio:');

    if (!offer) {
      return;
    }

    const amount = Number(offer.replace(',', '.'));

    if (!Number.isFinite(amount) || amount <= 0) {
      alert('Introduce un precio válido');
      return;
    }

    const senderId = this.currentUserId();
    const receiverId = this.messageReceiverId();
    const articleId = this.articleId();

    if (!senderId || !receiverId || !articleId) {
      return;
    }

    this.messageService
      .sendMessage(amount.toFixed(2), senderId, receiverId, articleId, 'PRICE_OFFER')
      .subscribe({
        next: () => {
          this.messages.update((messages) => [
            ...messages,
            {
              id: Date.now(),
              type: 'priceProposal',
              title: 'Propuesta de precio',
              amount,
              time: this.getCurrentTime(),
              mine: true,
            },
          ]);
        },
        error: (error) => console.error('Error al enviar propuesta de precio:', error),
      });
  }

  private sendDeliveryMethod(): void {
    const deliveryMethod = prompt(
      'Introduce el método de entrega:',
      'Envío por mensajería (MRW, SEUR, etc.)'
    );

    if (!deliveryMethod?.trim()) {
      return;
    }

    const senderId = this.currentUserId();
    const receiverId = this.messageReceiverId();
    const articleId = this.articleId();

    if (!senderId || !receiverId || !articleId) {
      return;
    }

    this.messageService
      .sendMessage(deliveryMethod.trim(), senderId, receiverId, articleId, 'DELIVERY_METHOD')
      .subscribe({
        next: () => {
          this.messages.update((messages) => [
            ...messages,
            {
              id: Date.now(),
              type: 'deliveryMethod',
              title: 'Método de entrega',
              text: deliveryMethod.trim(),
              time: this.getCurrentTime(),
              mine: true,
            },
          ]);
        },
        error: (error) => console.error('Error al enviar método de entrega:', error),
      });
  }

  private setConversation(conversation: IAConversation): void {
    this.conversationId.set(Number(conversation.conversation_id));
    this.articleId.set(Number(conversation.item_id));
    this.product.set(this.mapConversationProduct(conversation));
    this.receiveId.set(Number(conversation.buyer_id));
    this.sendId.set(Number(conversation.seller_id));

    this.contact.set(this.mapConversationContact(conversation));

    this.messages.set(conversation.messages.map((message) => this.mapConversationMessage(message)));
  }

  private mapConversationMessage(message: IAConversation['messages'][number]): ConversationMessage {
    const baseMessage = {
      id: message.id,
      time: this.formatTime(message.fecha_envio),
      mine: Number(message.emisor_id) === this.currentUserId(),
    };

    if (message.tipo_mensaje === 'PRICE_OFFER') {
      return {
        ...baseMessage,
        type: 'priceProposal',
        title: 'Propuesta de precio',
        amount: Number(message.texto_mensaje),
      };
    }

    if (message.tipo_mensaje === 'DELIVERY_METHOD') {
      return {
        ...baseMessage,
        type: 'deliveryMethod',
        title: 'Método de entrega',
        text: message.texto_mensaje,
      };
    }

    return {
      ...baseMessage,
      type: 'text',
      text: message.texto_mensaje,
    };
  }

  private mapConversationProduct(conversation: IAConversation): MessageProductSummary {
    return {
      id: conversation.item_id,
      title: conversation.titulo,
      price: Number(conversation.precio),
      imageUrl: conversation.foto || '/assets/logo/logo.png',
    };
  }

  private mapConversationContact(conversation: IAConversation): MessageContact {
    const name = this.getConversationContactName(conversation);

    return {
      name,
      initial: name.trim().charAt(0).toUpperCase() || 'U',
    };
  }
  private getConversationContactName(conversation: IAConversation): string {
    const isCurrentUserBuyer = Number(conversation.buyer_id) === this.currentUserId();
    const name = isCurrentUserBuyer ? conversation.seller_nombre : conversation.buyer_nombre;
    const surname = isCurrentUserBuyer ? conversation.seller_apellidos : conversation.buyer_apellidos;
    const username = isCurrentUserBuyer
      ? conversation.seller_nombre_usuario
      : conversation.buyer_nombre_usuario;
    const fullName = `${name || ''} ${surname || ''}`.trim();

    return fullName || username || `Usuario ${this.messageReceiverId()}`;
  }

  private formatTime(date: string): string {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }

  private getCurrentTime(): string {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MESSAGE_TEXT } from '../../../core/constants/message-text';
import { UserRole } from '../../../core/constants/user-role';
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

type MessageType = 'TEXT' | 'PRICE_OFFER' | 'DELIVERY_METHOD' | 'SYSTEM';

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
  reportId = signal(0);
  articleId = signal(0);
  currentUserId = signal(0);
  currentRole = signal<UserRole | null>(null);
  reportComplainantId = signal(0);
  receiveId = signal(0);
  sendId = signal(0);

  isLoading = signal(false);

  hasMessages = computed(() => this.messages().length > 0);
  isLoggedIn = computed(() => this.currentUserId() > 0);
  isReceiver = computed(() => this.currentUserId() === this.receiveId());
  isSender = computed(() => this.currentUserId() === this.sendId());
  isModeratorView = computed(() => this.reportId() > 0);
  isStaffViewer = computed(() => {
    const role = this.currentRole();
    return role === UserRole.MODERATOR || role === UserRole.ADMIN;
  });
  isAdminViewer = computed(() => this.currentRole() === UserRole.ADMIN);

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
  ) { }

  ngOnInit(): void {
    this.conversationId.set(Number(this.route.snapshot.paramMap.get('conversationId')));
    this.reportId.set(Number(this.route.snapshot.paramMap.get('reportId')));
    this.articleId.set(Number(this.route.snapshot.paramMap.get('articleId')));

    this.currentUserId.set(
      this.authService.getCurrentUserId() ??
      Number(this.route.snapshot.paramMap.get('userId'))
    );
    this.currentRole.set(this.authService.getCurrentRole());

    this.loadConversation();
  }

  async loadConversation(): Promise<void> {
    if (
      !this.reportId() &&
      ((!this.conversationId() && !this.articleId()) || !this.currentUserId())
    ) {
      return;
    }

    this.isLoading.set(true);

    try {
      let conversation: IAConversation;

      if (this.reportId()) {
        conversation = await this.messageService.getConversationByReport(this.reportId());
      } else if (this.conversationId()) {
        conversation = await this.messageService.getConversationById(
          this.conversationId(),
          this.currentUserId()
        );
      } else {
        conversation = await this.messageService.getConversation(
          this.articleId(),
          this.currentUserId()
        );
      }

      this.setConversation(conversation);
    } catch (error) {
      console.error('Error al cargar la conversación:', error);
      this.messages.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  onBack(): void {
    history.back();
  }

  onActionSelected(action: MessageAction): void {
    if (this.isModeratorView()) {
      return;
    }

    if (action === 'buy' && !this.isLoggedIn()) {
      alert(MESSAGE_TEXT.articleDetail.buyLoginRequired);
      return;
    }

    if (action === 'price') {
      this.sendPriceOffer();
      return;
    }

    if (action === 'delivery') {
      this.sendDeliveryMethod();
      return;
    }

    console.log('Acción de mensaje seleccionada:', action);
  }

  onMessageSent(message: string): void {
    this.send(message, 'TEXT');
  }

  private sendPriceOffer(): void {
    const price = prompt('Introduce la propuesta de precio');

    if (!price?.trim()) {
      return;
    }

    const normalizedPrice = price.trim().replace(',', '.');

    if (!/^\d+(\.\d{1,2})?$/.test(normalizedPrice)) {
      alert('La propuesta de precio solo puede contener números');
      return;
    }

    this.send(normalizedPrice, 'PRICE_OFFER');
  }

  private sendDeliveryMethod(): void {
    const method = prompt('Introduce el método de entrega');

    if (!method?.trim()) {
      return;
    }

    this.send(method.trim(), 'DELIVERY_METHOD');
  }

  private send(message: string, tipoMensaje: MessageType = 'TEXT'): void {
    const senderId = this.currentUserId();
    const cleanMessage = message.trim();

    if (!senderId || !cleanMessage) {
      return;
    }

    if (this.isModeratorView()) {
      this.messageService
        .sendReportMessage(
          cleanMessage,
          senderId,
          this.reportId()
        )
        .subscribe({
          next: () => {
            this.addLocalMessage(cleanMessage, 'SYSTEM');
          },
          error: (error: unknown) => {
            console.error('Error al enviar mensaje de reporte:', error);
          },
        });

      return;
    }

    const receiverId = this.messageReceiverId();
    const articleId = this.articleId();

    if (!receiverId || !articleId) {
      return;
    }

    this.messageService
      .sendMessage(
        cleanMessage,
        senderId,
        receiverId,
        articleId,
        tipoMensaje
      )
      .subscribe({
        next: () => {
          this.addLocalMessage(cleanMessage, tipoMensaje);
        },
        error: (error: unknown) => {
          console.error('Error al enviar mensaje:', error);
        },
      });
  }

  private addLocalMessage(message: string, tipoMensaje: MessageType): void {
    let newMessage: ConversationMessage;

    switch (tipoMensaje) {
      case 'PRICE_OFFER':
        newMessage = {
          id: Date.now(),
          type: 'priceProposal',
          title: 'Propuesta de precio',
          amount: Number(message),
          time: this.getCurrentTime(),
          mine: true,
        };
        break;

      case 'DELIVERY_METHOD':
        newMessage = {
          id: Date.now(),
          type: 'deliveryMethod',
          title: 'Método de entrega',
          text: message,
          time: this.getCurrentTime(),
          mine: true,
        };
        break;

      case 'SYSTEM':
      case 'TEXT':
      default:
        newMessage = {
          id: Date.now(),
          type: 'text',
          text: message,
          time: this.getCurrentTime(),
          mine: true,
        };
        break;
    }

    this.messages.update((messages) => [...messages, newMessage]);
  }

  private setConversation(conversation: IAConversation): void {
    this.conversationId.set(Number(conversation.conversation_id));
    this.articleId.set(Number(conversation.item_id));
    this.product.set(this.mapConversationProduct(conversation));
    this.reportComplainantId.set(Number(conversation.report_denunciante_id || 0));
    this.receiveId.set(Number(conversation.buyer_id));
    this.sendId.set(Number(conversation.seller_id));

    this.contact.set(this.mapConversationContact(conversation));

    const visibleMessages = this.isModeratorView()
      ? conversation.messages.filter((message) => message.tipo_mensaje === 'SYSTEM')
      : conversation.messages.filter((message) => message.tipo_mensaje !== 'SYSTEM');

    this.messages.set(
      visibleMessages.map((message) => this.mapConversationMessage(message))
    );
  }

  private mapConversationMessage(
    message: IAConversation['messages'][number]
  ): ConversationMessage {
    const baseMessage = {
      id: message.id,
      time: this.formatTime(message.fecha_envio),
      mine: this.isMessageMine(message),
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

  private mapConversationProduct(
    conversation: IAConversation
  ): MessageProductSummary {
    return {
      id: conversation.item_id,
      title: conversation.titulo,
      price: Number(conversation.precio),
      imageUrl: conversation.foto || '/assets/logo/logo.png',
    };
  }

  private isMessageMine(message: IAConversation['messages'][number]): boolean {
    if (this.isModeratorView() && this.isStaffViewer()) {
      return message.emisor_rol_id === UserRole.MODERATOR || message.emisor_rol_id === UserRole.ADMIN;
    }

    return Number(message.emisor_id) === this.currentUserId();
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

    const name = isCurrentUserBuyer
      ? conversation.seller_nombre
      : conversation.buyer_nombre;

    const surname = isCurrentUserBuyer
      ? conversation.seller_apellidos
      : conversation.buyer_apellidos;

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

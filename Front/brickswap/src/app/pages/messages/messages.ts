import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IAConversationListItem } from '../../core/interfaces/iconversation.interfaces';
import { AuthService } from '../../core/services/auth/auth.service';
import { MessageService } from '../../core/services/message/message.service';
import { PillComponent } from '../../shared/ui/pill/pill.component';
import { OrdenarListaComponent, SortOrder } from '../../shared/ui/ordenar-lista/ordenar-lista.component';
import { CajaMensajeComponent, MessageStatus } from '../../shared/caja-mensaje/caja-mensaje.component';
import { DescriptionsComponent } from '../../shared/ui/descriptions/descriptions.component';

@Component({
  selector: 'app-messages',
  imports: [RouterLink, PillComponent, OrdenarListaComponent, CajaMensajeComponent, DescriptionsComponent],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class MessagesPage {
  selectedTab = signal<string>('all');
  sortOrder = signal<SortOrder>('newest');
  conversations = signal<IAConversationListItem[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  authService = inject(AuthService);
  messageService = inject(MessageService);

 ngOnInit(): void {
  this.loadData();
} 

 filteredConversations = computed(() => {
  const selectedTab = this.selectedTab();
  const sortOrder = this.sortOrder();

  let conversations = [...this.conversations()];

  // Filtrado por estado
  if (selectedTab !== 'all') {
    const status = this.tabToStatus(selectedTab);

    conversations = conversations.filter(
      conversation => this.statusValue(conversation) === status
    );
  }

  // Ordenación por fecha del último mensaje
  conversations.sort((a, b) => {
    const dateA = new Date(
      a.last_message_fecha_envio || a.conversation_last_message_at || 0
    ).getTime();

    const dateB = new Date(
      b.last_message_fecha_envio || b.conversation_last_message_at || 0
    ).getTime();

    return sortOrder === 'newest'
      ? dateB - dateA
      : dateA - dateB;
  });

  return conversations;
});

  async loadData(): Promise<void> {
    const userId = this.authService.getCurrentUserId()
    if (!userId) {
      this.errorMessage.set('No se ha podido identificar al usuario logueado');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const conversations = await this.messageService.getConversations(userId);
      this.conversations.set(conversations);
    } catch (error) {
      console.error('Error al cargar conversaciones:', error);
      this.errorMessage.set('No se han podido cargar las conversaciones');
    } finally {
      this.isLoading.set(false);
    }
  }

 async onStatusChanged(id: number, status: MessageStatus): Promise<void> {
  const previous = this.conversations()
    .find(c => c.conversation_id === id)?.status;

  this.conversations.update(conversations =>
    conversations.map(c =>
      c.conversation_id === id ? { ...c, status } : c
    )
  );

  try {
    await this.messageService.changeConversationStatus(id, status);
  } catch (error) {
    console.error('Error al cambiar status:', error);
    if (previous) {
      this.conversations.update(conversations =>
        conversations.map(c =>
          c.conversation_id === id ? { ...c, status: previous } : c
        )
      );
    }
  }
}

  setOrder(order: SortOrder) {
    this.sortOrder.set(order);
  }

  otherUserName(conversation: IAConversationListItem): string {
    const currentUserId = this.authService.getCurrentUserId();
    const isBuyer = Number(conversation.buyer_id) === currentUserId;
    const name = isBuyer ? conversation.seller_nombre : conversation.buyer_nombre;
    const surname = isBuyer ? conversation.seller_apellidos : conversation.buyer_apellidos;
    const username = isBuyer ? conversation.seller_nombre_usuario : conversation.buyer_nombre_usuario;
    const fullName = `${name || ''} ${surname || ''}`.trim();

    return fullName || username || 'Usuario';
  }

  timeAgo(conversation: IAConversationListItem): string {
    const date = conversation.last_message_fecha_envio || conversation.conversation_last_message_at;

    if (!date) {
      return '';
    }

    const sentAt = new Date(date);

    if (Number.isNaN(sentAt.getTime())) {
      return '';
    }

    const diffMs = Date.now() - sentAt.getTime();
    const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

    if (diffMinutes < 1) {
      return 'Ahora';
    }

    if (diffMinutes < 60) {
      return `Hace ${diffMinutes} min`;
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
      return `Hace ${diffHours} h`;
    }

    const diffDays = Math.floor(diffHours / 24);

    return diffDays === 1 ? 'Hace 1 día' : `Hace ${diffDays} días`;
  }

  statusValue(conversation: IAConversationListItem): MessageStatus {
    return conversation.status || 'unreaded';
  }

  lastMessagePreview(conversation: IAConversationListItem): string {
    if (conversation.last_message_type === 'PRICE_OFFER') {
      return `Propuesta de precio: ${Number(conversation.last_message_text || 0).toFixed(2)} €`;
    }

    if (conversation.last_message_type === 'DELIVERY_METHOD') {
      return `Método de entrega: ${conversation.last_message_text || ''}`;
    }

    return conversation.last_message_text || '';
  }

  onConversationClick(conversation: IAConversationListItem): void{
    
    const currentUserId = this.authService.getCurrentUserId();
    const lastMessageIsFromMe = conversation.last_message_sender_id === currentUserId;

    if (lastMessageIsFromMe) {
    return;
    }

    if (conversation.status === 'unreaded') {
      this.onStatusChanged(conversation.conversation_id, 'readed');
    }
  }

  private tabToStatus(tab: string): MessageStatus {
    const statusByTab: Record<string, MessageStatus> = {
      unreaded: 'unreaded',
      readed: 'readed',
      pending: 'pending',
      resolved: 'resolved',
    };

    return statusByTab[tab] || 'unreaded';
  }
}

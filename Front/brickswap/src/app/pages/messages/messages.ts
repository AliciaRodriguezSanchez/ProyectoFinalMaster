import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IAConversationListItem } from '../../core/interfaces/iconversation.interfaces';
import { AuthService } from '../../core/services/auth/auth.service';
import { MessageService } from '../../core/services/message/message.service';
import { PillComponent } from '../../shared/ui/pill/pill.component';
import { OrdenarListaComponent, SortOrder } from '../../shared/ui/ordenar-lista/ordenar-lista.component';
import { CajaMensajeComponent, MessageStatus } from '../../shared/caja-mensaje/caja-mensaje.component';

@Component({
  selector: 'app-messages',
  imports: [RouterLink, PillComponent, OrdenarListaComponent, CajaMensajeComponent],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class MessagesPage implements OnInit {
  selectedTab = signal<string>('all');
  sortOrder = signal<SortOrder>('newest');
  conversations = signal<IAConversationListItem[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  filteredConversations = computed(() => {
    const selectedTab = this.selectedTab();
    const sortOrder = this.sortOrder();

  loadData(){

  }

  async loadData(): Promise<void> {
    const userId = this.authService.getCurrentUserId();

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

  onStatusChanged(id: number, status: MessageStatus) {
    this.conversations.update(conversations =>
      conversations.map(conversation =>
        conversation.conversation_id === id ? { ...conversation, status } : conversation
      )
    );
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
    return conversation.status || 'Sin leer';
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

  private tabToStatus(tab: string): MessageStatus {
    const statusByTab: Record<string, MessageStatus> = {
      unreaded: 'Sin leer',
      readed: 'Leído',
      pending: 'Pendiente',
      resolved: 'Resuelto',
    };

    return statusByTab[tab] || 'Sin leer';
  }
}

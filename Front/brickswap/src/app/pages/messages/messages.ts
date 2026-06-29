import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MESSAGE_TYPE } from '../../core/constants/message';
import { MESSAGE_TEXT } from '../../core/constants/message-text';
import { UserRole } from '../../core/constants/user-role';
import { IAConversationListItem } from '../../core/interfaces/iconversation.interfaces';
import { AuthService } from '../../core/services/auth/auth.service';
import { MessageService } from '../../core/services/message/message.service';
import { ReportService } from '../../core/services/report/report.service';
import { IReportsTable } from '../../interfaces/ireports-table.interface';
import { CajaMensajeComponent, MessageStatus } from '../../shared/components/caja-mensaje/caja-mensaje.component';
import { DescriptionsComponent } from '../../shared/ui/descriptions/descriptions.component';
import { OrdenarListaComponent, SortOrder } from '../../shared/ui/ordenar-lista/ordenar-lista.component';
import { PillComponent } from '../../shared/ui/pill/pill.component';

@Component({
  selector: 'app-messages',
  imports: [RouterLink, PillComponent, OrdenarListaComponent, CajaMensajeComponent, DescriptionsComponent],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class MessagesPage implements OnInit {
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private reportService = inject(ReportService);
  protected readonly text = MESSAGE_TEXT.messages;

  selectedTab = signal<string>('all');
  sortOrder = signal<SortOrder>('newest');
  currentRole = signal<UserRole | null>(null);
  conversations = signal<IAConversationListItem[]>([]);
  reports = signal<IReportsTable[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  isReportsMode = computed(() => {
    const role = this.currentRole();
    return role === UserRole.ADMIN || role === UserRole.MODERATOR;
  });

  filteredConversations = computed(() => {
    const selectedTab = this.selectedTab();
    const sortOrder = this.sortOrder();
    let conversations = [...this.conversations()];

    if (selectedTab !== 'all') {
      const status = this.tabToStatus(selectedTab);
      conversations = conversations.filter((conversation) => this.statusValue(conversation) === status);
    }

    return conversations.sort((first, second) => {
      const firstTime = new Date(first.last_message_fecha_envio || first.conversation_last_message_at || 0).getTime();
      const secondTime = new Date(second.last_message_fecha_envio || second.conversation_last_message_at || 0).getTime();

      return sortOrder === 'newest' ? secondTime - firstTime : firstTime - secondTime;
    });
  });

  filteredReports = computed(() => {
    const sortOrder = this.sortOrder();
    const selectedTab = this.selectedTab();
    let reports = [...this.reports()];

    if (selectedTab !== 'all') {
      if (selectedTab === 'pending') {
        reports = reports.filter((report) => report.estado_reporte === 'Pendiente');
      }

      if (selectedTab === 'resolved') {
        reports = reports.filter((report) => report.estado_reporte !== 'Pendiente');
      }

      if (selectedTab !== 'pending' && selectedTab !== 'resolved') {
        reports = [];
      }
    }

    return reports.sort((first, second) => {
      const firstTime = new Date(first.fecha_reporte || 0).getTime();
      const secondTime = new Date(second.fecha_reporte || 0).getTime();

      return sortOrder === 'newest' ? secondTime - firstTime : firstTime - secondTime;
    });
  });

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    const userId = this.authService.getCurrentUserId();
    const role = this.authService.getCurrentRole();

    if (!userId || !role) {
      this.errorMessage.set(this.text.loggedUserError);
      return;
    }

    this.currentRole.set(role);
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      if (role === UserRole.ADMIN || role === UserRole.MODERATOR) {
        await this.getReports();
        return;
      }

      if (role === UserRole.USER) {
        await this.getUserMessagesAndReports(userId);
        return;
      }

      this.errorMessage.set(this.text.unsupportedUserType);
    } catch (error) {
      console.error('Error al cargar la vista de mensajes:', error);
      this.errorMessage.set(this.text.loadDataError);
    } finally {
      this.isLoading.set(false);
    }
  }

  async onStatusChanged(id: number, status: MessageStatus): Promise<void> {
    const previous = this.conversations().find((conversation) => conversation.conversation_id === id)?.status;

    this.conversations.update((conversations) =>
      conversations.map((conversation) =>
        conversation.conversation_id === id ? { ...conversation, status } : conversation
      )
    );

    try {
      await this.messageService.changeConversationStatus(id, status);
    } catch (error) {
      console.error('Error al cambiar status:', error);

      if (previous) {
        this.conversations.update((conversations) =>
          conversations.map((conversation) =>
            conversation.conversation_id === id ? { ...conversation, status: previous } : conversation
          )
        );
      }
    }
  }

  onConversationClick(conversation: IAConversationListItem): void {
    const currentUserId = this.authService.getCurrentUserId();
    const lastMessageIsFromMe = conversation.last_message_sender_id === currentUserId;

    if (lastMessageIsFromMe) {
      return;
    }

    if (conversation.status === 'unreaded') {
      this.onStatusChanged(conversation.conversation_id, 'readed');
    }
  }

  setOrder(order: SortOrder): void {
    this.sortOrder.set(order);
  }

  otherUserName(conversation: IAConversationListItem): string {
    const currentUserId = this.authService.getCurrentUserId();
    const isBuyer = Number(conversation.buyer_id) === currentUserId;
    const name = isBuyer ? conversation.seller_nombre : conversation.buyer_nombre;
    const surname = isBuyer ? conversation.seller_apellidos : conversation.buyer_apellidos;
    const username = isBuyer ? conversation.seller_nombre_usuario : conversation.buyer_nombre_usuario;
    const fullName = `${name || ''} ${surname || ''}`.trim();

    return fullName || username || this.text.defaultUser;
  }

  timeAgo(conversation: IAConversationListItem): string {
    const date = conversation.last_message_fecha_envio || conversation.conversation_last_message_at;
    return this.timeAgoFromDate(date);
  }

  statusValue(conversation: IAConversationListItem): MessageStatus {
    return conversation.status || 'unreaded';
  }

  lastMessagePreview(conversation: IAConversationListItem): string {
    if (conversation.last_message_type === MESSAGE_TYPE.PRICE_OFFER) {
      return `${this.text.priceOfferLabel}: ${Number(conversation.last_message_text || 0).toFixed(2)} €`;
    }

    if (conversation.last_message_type === MESSAGE_TYPE.DELIVERY_METHOD) {
      return `${this.text.deliveryMethodLabel}: ${conversation.last_message_text || ''}`;
    }

    return conversation.last_message_text || '';
  }

  reportTitle(report: IReportsTable): string {
    return report.titulo || `${this.text.articleFallbackPrefix} #${report.articulo_id}`;
  }

  reportStatusValue(report: IReportsTable): MessageStatus {
    if (report.estado_reporte === 'Pendiente') {
      return 'pending';
    }

    return 'resolved';
  }

  reportPreview(report: IReportsTable): string {
    const status = report.estado_reporte === 'Pendiente' ? this.text.reportPending : this.text.reportResolved;

    return report.resolucion_comentario
      ? `${status}: ${this.text.reportResolutionPrefix}: ${report.resolucion_comentario}`
      : `${status}: ${this.text.reportReasonPrefix}: ${report.motivo}`;
  }

  reportTimeAgo(report: IReportsTable): string {
    return this.timeAgoFromDate(report.fecha_reporte);
  }

  private async getUserMessagesAndReports(userId: number): Promise<void> {
    const [conversations, reports] = await Promise.all([
      this.messageService.getConversations(userId),
      this.reportService.getReportsByUser(userId),
    ]);

    this.conversations.set(conversations);
    this.reports.set(reports);
  }

  private async getReports(): Promise<void> {
    const reports = await this.reportService.getAllReports();
    this.reports.set(reports);
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

  private timeAgoFromDate(date: string): string {
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
      return this.text.now;
    }

    if (diffMinutes < 60) {
      return `${this.text.minutesAgo} ${diffMinutes} min`;
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
      return `${this.text.hoursAgo} ${diffHours} h`;
    }

    const diffDays = Math.floor(diffHours / 24);

    return diffDays === 1 ? this.text.oneDayAgo : `${this.text.daysAgo} ${diffDays} días`;
  }
}

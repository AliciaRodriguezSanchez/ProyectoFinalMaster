import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IAConversationListItem } from '../../core/interfaces/iconversation.interfaces';
import { UserRole } from '../../core/constants/user-role';
import { AuthService } from '../../core/services/auth/auth.service';
import { MessageService } from '../../core/services/message/message.service';
import { ReportService } from '../../core/services/report/report.service';
import { IReportsTable } from '../../interfaces/ireports-table.interface';
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

    return this.conversations()
      .filter((conversation) => selectedTab === 'all' || this.statusValue(conversation) === this.tabToStatus(selectedTab))
      .sort((first, second) => {
        const firstTime = new Date(first.last_message_fecha_envio || first.conversation_last_message_at).getTime();
        const secondTime = new Date(second.last_message_fecha_envio || second.conversation_last_message_at).getTime();

        return sortOrder === 'newest' ? secondTime - firstTime : firstTime - secondTime;
      });
  });

  filteredReports = computed(() => {
    const selectedTab = this.selectedTab();
    const sortOrder = this.sortOrder();

    return this.reports()
      .filter((report) => selectedTab === 'all' || this.reportStatusValue(report) === this.tabToStatus(selectedTab))
      .sort((first, second) => {
        const firstTime = new Date(first.fecha_reporte).getTime();
        const secondTime = new Date(second.fecha_reporte).getTime();

        return sortOrder === 'newest' ? secondTime - firstTime : firstTime - secondTime;
      });
  });

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {

    const userId = this.authService.getCurrentUserId();
    const role = this.authService.getCurrentRole();

    if (!userId || !role) {
      this.errorMessage.set('No se ha podido identificar al usuario logueado');
      return;
    }

    this.currentRole.set(role);
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      if (role === UserRole.ADMIN || role === UserRole.MODERATOR) {
        await this.getAllReports();
        return; 
      }

      if (role === UserRole.USER) {
        await this.getMessage(userId);
        return;
      }

      this.errorMessage.set('Tipo de usuario no soportado');
    } catch (error) {
      console.error('Error al cargar la vista de mensajes:', error);
      this.errorMessage.set('No se han podido cargar los datos');
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
    return this.timeAgoFromDate(date);
  }

  statusValue(conversation: IAConversationListItem): MessageStatus {
    return conversation.status || 'Sin leer';
  }

  reportStatusValue(report: IReportsTable): MessageStatus {
    return report.estado_reporte === 'Pendiente' ? 'Pendiente' : 'Resuelto';
  }

  reportTimeAgo(report: IReportsTable): string {
    return this.timeAgoFromDate(report.fecha_reporte);
  }

  reportCardName(report: IReportsTable): string {
    return this.isReportsMode() ? report.nombre || 'Usuario' : 'Moderación';
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

  private async getAllReports(): Promise<void> {
    const reports = await this.reportService.getAllReports();
    this.reports.set(reports);
    this.conversations.set([]);
  }

  private async getMessage(userId: number): Promise<void> {
    const [conversations, reports] = await Promise.all([
      this.messageService.getConversations(userId),
      this.reportService.getReportsByUser(userId),
    ]);

    this.conversations.set(conversations);
    this.reports.set(reports);
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
}

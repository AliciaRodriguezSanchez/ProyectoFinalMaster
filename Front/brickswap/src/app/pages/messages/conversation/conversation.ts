import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import {
  MESSAGE_ACTION,
  MESSAGE_SEND_ICON,
  MESSAGE_TYPE,
  MessageAction,
  MessageType,
} from '../../../core/constants/message';
import { MESSAGE_TEXT } from '../../../core/constants/message-text';
import { APP_ASSETS } from '../../../core/constants/app-assets';
import {
  ARTICLE_SALE_STATUS,
  CONVERSATION_STATUS,
  REPORT_STATUS,
  ReportStatus,
} from '../../../core/constants/status';
import { UserRole } from '../../../core/constants/user-role';
import { IAConversation } from '../../../interfaces/iconversation.interfaces';
import { ArticleService } from '../../../core/services/article/article.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MessageService } from '../../../core/services/message/message.service';
import { ReportService } from '../../../core/services/report/report.service';
import { UiToastService } from '../../../core/services/toast/ui-toast.service';
import { buyArticleWithToast } from '../../../core/utils/article-actions';
import {
  MessageContact,
  MessageProductSummary,
} from '../../../shared/components/message-conversation-header/message-conversation-header.interface';
import {
  ConversationMessage,
} from '../../../shared/components/message-thread/message-threads.interface';
import { ActionModalComponent } from '../../../shared/components/action-modal/action-modal.component';
import { SharedMessagesComponentsModule } from '../../../shared/components/shared-messages-components.module';
import { UiButtonComponent } from '../../../shared/ui/button/ui-button.component';
import { UiTextareaComponent } from '../../../shared/ui/textarea/ui-textarea.component';

@Component({
  selector: 'app-conversation',
  imports: [
    SharedMessagesComponentsModule,
    ActionModalComponent,
    UiButtonComponent,
    UiTextareaComponent
  ],
  templateUrl: './conversation.html',
  styleUrl: './conversation.css',
})
export class ConversationPage implements OnInit {
  protected readonly text = MESSAGE_TEXT.messages;
  protected readonly saleStatus = ARTICLE_SALE_STATUS;
  protected readonly reportStatusValue = REPORT_STATUS;
  protected readonly sendIcon = MESSAGE_SEND_ICON;
  emptyText = this.text.emptyConversation;

  contact = signal<MessageContact | null>(null);
  product = signal<MessageProductSummary | null>(null);
  messages = signal<ConversationMessage[]>([]);

  conversationId = signal(0);
  reportId = signal(0);
  articleId = signal(0);
  currentUserId = signal(0);
  currentRole = signal<UserRole | null>(null);
  reportComplainantId = signal(0);
  reportStatus = signal('');
  conversationStatus = signal('');
  articleSaleStatus = signal('');
  reportResolution = signal('');
  isUpdatingReport = signal(false);
  isSendingReportMessage = signal(false);
  receiveId = signal(0);
  sendId = signal(0);
  actionModalType = signal<'price' | 'delivery' | null>(null);

  isLoading = signal(false);

  hasMessages = computed(() => this.messages().length > 0);
  isLoggedIn = computed(() => this.currentUserId() > 0);
  isReceiver = computed(() => this.currentUserId() === this.receiveId());
  isSender = computed(() => this.currentUserId() === this.sendId());
  isReportConversation = computed(() => this.reportId() > 0 || this.reportComplainantId() > 0);
  isModeratorView = computed(() => this.isReportConversation());
  isStaffViewer = computed(() => {
    const role = this.currentRole();
    return role === UserRole.MODERATOR || role === UserRole.ADMIN;
  });
  isAdminViewer = computed(() => this.currentRole() === UserRole.ADMIN);
  isReportResolved = computed(() => this.reportStatus() !== '' && this.reportStatus() !== REPORT_STATUS.pending);
  isConversationResolved = computed(() => this.conversationStatus() === CONVERSATION_STATUS.resolved);
  isArticleSold = computed(() => this.articleSaleStatus() === ARTICLE_SALE_STATUS.sold);
  reportStatusLabel = computed(() =>
    this.isReportResolved() ? this.text.reportResolved : this.text.reportPending
  );
  canReplyReport = computed(() =>
    this.isModeratorView() &&
    this.currentRole() === UserRole.MODERATOR &&
    !this.isReportResolved()
  );

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
    private articleService: ArticleService,
    private messageService: MessageService,
    private reportService: ReportService,
    private authService: AuthService,
    private toastService: UiToastService
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
      await this.markConversationAsReadIfNeeded(conversation);
    } catch (error) {
      console.error(error);
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

    if (action === MESSAGE_ACTION.BUY && !this.isLoggedIn()) {
      this.toastService.warning(MESSAGE_TEXT.articleDetail.actionLoginRequired);
      return;
    }

    if (action === MESSAGE_ACTION.BUY) {
      this.buyCurrentArticle();
      return;
    }

    if (action === MESSAGE_ACTION.PRICE) {
      this.actionModalType.set('price');
      return;
    }

    if (action === MESSAGE_ACTION.DELIVERY) {
      this.actionModalType.set('delivery');
      return;
    }

    console.log({ action });
  }

  buyCurrentArticle(): void {
    const articleId = this.articleId();

    if (!articleId) {
      return;
    }

    void buyArticleWithToast({
      articleService: this.articleService,
      toastService: this.toastService,
      articleId,
      onSuccess: () => {
        this.conversationStatus.set(CONVERSATION_STATUS.resolved);
        this.articleSaleStatus.set(ARTICLE_SALE_STATUS.sold);
        this.resolveCurrentConversation();
      },
    });
  }

  private resolveCurrentConversation(): void {
    const conversationId = this.conversationId();

    if (!conversationId) {
      return;
    }

    this.messageService.changeConversationStatus(conversationId, CONVERSATION_STATUS.resolved)
      .catch((error: unknown) => {
        console.error(error);
      });
  }

  onMessageSent(message: string): void {
    this.send(message, MESSAGE_TYPE.TEXT);
  }

  closeActionModal(): void {
    this.actionModalType.set(null);
  }

  submitActionModal(value: string): void {
    if (this.actionModalType() === 'price') {
      this.sendPriceOffer(value);
      return;
    }

    if (this.actionModalType() === 'delivery') {
      this.sendDeliveryMethod(value);
    }
  }

  getActionModalTitle(): string {
    return this.actionModalType() === 'price'
      ? this.text.priceOfferModalTitle
      : this.text.deliveryMethodModalTitle;
  }

  getActionModalTextareaLabel(): string {
    return this.actionModalType() === 'price'
      ? this.text.priceOfferModalLabel
      : this.text.deliveryMethodModalLabel;
  }

  getActionModalPlaceholder(): string {
    return this.actionModalType() === 'price'
      ? this.text.priceOfferPrompt
      : this.text.deliveryMethodPrompt;
  }

  getActionModalSubmitLabel(): string {
    return this.actionModalType() === 'price'
      ? this.text.priceOfferModalSubmit
      : this.text.deliveryMethodModalSubmit;
  }

  async updateReportStatus(status: ReportStatus): Promise<void> {
    const resolution = this.reportResolution().trim();

    if (!this.reportId() || !this.canReplyReport() || !resolution) {
      return;
    }

    this.isUpdatingReport.set(true);

    try {
      await this.reportService.actualizarReporte({
        id: this.reportId(),
        estado: status,
        resolucion: resolution,
      });

      this.reportResolution.set('');
      await this.loadConversation();
    } catch (error) {
      console.error(error);
      this.toastService.error(this.text.updateReportError);
    } finally {
      this.isUpdatingReport.set(false);
    }
  }

  async sendReportReply(): Promise<void> {
    const message = this.reportResolution().trim();
    const senderId = this.currentUserId();

    if (!this.reportId() || !this.canReplyReport() || !senderId || !message) {
      return;
    }

    this.isSendingReportMessage.set(true);

    try {
      await firstValueFrom(
        this.messageService.sendReportMessage(
          message,
          senderId,
          this.reportId()
        )
      );

      this.addLocalMessage(message, MESSAGE_TYPE.SYSTEM);
      this.reportResolution.set('');
    } catch (error) {
      console.error(error);
      this.toastService.error(this.text.sendReportMessageError);
    } finally {
      this.isSendingReportMessage.set(false);
    }
  }

  private sendPriceOffer(price: string): void {
    const normalizedPrice = price.trim().replace(',', '.');

    if (!/^\d+(\.\d{1,2})?$/.test(normalizedPrice)) {
      this.toastService.warning(this.text.priceOfferNumericError);
      return;
    }

    this.closeActionModal();
    void this.send(normalizedPrice, MESSAGE_TYPE.PRICE_OFFER);
  }

  private sendDeliveryMethod(method: string): void {
    this.closeActionModal();
    void this.send(method.trim(), MESSAGE_TYPE.DELIVERY_METHOD);
  }

  private async send(message: string, tipoMensaje: MessageType = MESSAGE_TYPE.TEXT): Promise<void> {
    const senderId = this.currentUserId();
    const cleanMessage = message.trim();

    if (!senderId || !cleanMessage) {
      return;
    }

    if (this.isModeratorView()) {
      if (!this.canReplyReport()) {
        return;
      }

      try {
        await firstValueFrom(
          this.messageService.sendReportMessage(
            cleanMessage,
            senderId,
            this.reportId()
          )
        );

        this.addLocalMessage(cleanMessage, MESSAGE_TYPE.SYSTEM);
      } catch (error) {
        console.error(error);
      }

      return;
    }

    const receiverId = this.messageReceiverId();
    const articleId = this.articleId();

    if (!receiverId || !articleId) {
      return;
    }

    try {
      await firstValueFrom(
        this.messageService.sendMessage(
          cleanMessage,
          senderId,
          receiverId,
          articleId,
          tipoMensaje
        )
      );

      this.addLocalMessage(cleanMessage, tipoMensaje);
    } catch (error) {
      console.error(error);
    }
  }

  private addLocalMessage(message: string, tipoMensaje: MessageType): void {
    let newMessage: ConversationMessage;

    switch (tipoMensaje) {
      case MESSAGE_TYPE.PRICE_OFFER:
        newMessage = {
          id: Date.now(),
          type: 'priceProposal',
          title: this.text.priceOfferLabel,
          amount: Number(message),
          time: this.getCurrentTime(),
          mine: true,
        };
        break;

      case MESSAGE_TYPE.DELIVERY_METHOD:
        newMessage = {
          id: Date.now(),
          type: 'deliveryMethod',
          title: this.text.deliveryMethodLabel,
          text: message,
          time: this.getCurrentTime(),
          mine: true,
        };
        break;

      case MESSAGE_TYPE.SYSTEM:
      case MESSAGE_TYPE.TEXT:
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
    this.conversationStatus.set(conversation.status || '');
    this.articleSaleStatus.set(conversation.estado_venta || '');
    this.articleId.set(Number(conversation.item_id));
    this.product.set(this.mapConversationProduct(conversation));
    this.reportId.set(Number(conversation.report_id || this.reportId()));
    this.reportComplainantId.set(Number(conversation.report_denunciante_id || 0));
    this.reportStatus.set(conversation.report_status || '');
    this.receiveId.set(Number(conversation.buyer_id));
    this.sendId.set(Number(conversation.seller_id));

    this.contact.set(this.mapConversationContact(conversation));

    const visibleMessages = this.isModeratorView()
      ? conversation.messages.filter((message) => message.tipo_mensaje === MESSAGE_TYPE.SYSTEM)
      : conversation.messages.filter((message) => message.tipo_mensaje !== MESSAGE_TYPE.SYSTEM);

    this.messages.set(
      visibleMessages.map((message) => this.mapConversationMessage(message))
    );
  }

  private async markConversationAsReadIfNeeded(conversation: IAConversation): Promise<void> {
    const conversationId = Number(conversation.conversation_id);
    const currentUserId = this.currentUserId();
    const lastMessage = conversation.messages.at(-1);

    if (
      !conversationId ||
      !currentUserId ||
      conversation.status !== CONVERSATION_STATUS.unreaded ||
      !lastMessage ||
      Number(lastMessage.emisor_id) === currentUserId
    ) {
      return;
    }

    try {
      await this.messageService.changeConversationStatus(
        conversationId,
        CONVERSATION_STATUS.readed
      );
      this.conversationStatus.set(CONVERSATION_STATUS.readed);
    } catch (error) {
      console.error('Error al marcar la conversación como leída:', error);
    }
  }

  private mapConversationMessage(
    message: IAConversation['messages'][number]
  ): ConversationMessage {
    const baseMessage = {
      id: message.id,
      time: this.formatTime(message.fecha_envio),
      mine: this.isMessageMine(message),
    };

    if (message.tipo_mensaje === MESSAGE_TYPE.PRICE_OFFER) {
      return {
        ...baseMessage,
        type: 'priceProposal',
        title: this.text.priceOfferLabel,
        amount: Number(message.texto_mensaje),
      };
    }

    if (message.tipo_mensaje === MESSAGE_TYPE.DELIVERY_METHOD) {
      return {
        ...baseMessage,
        type: 'deliveryMethod',
        title: this.text.deliveryMethodLabel,
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
      imageUrl: conversation.foto || APP_ASSETS.logo,
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
      initial: name.trim().charAt(0).toUpperCase() || this.text.defaultUser.charAt(0),
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

    return fullName || username || `${this.text.defaultUser} ${this.messageReceiverId()}`;
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

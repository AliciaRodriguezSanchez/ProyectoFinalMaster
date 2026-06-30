import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Article } from '../../core/models/article/article.model';
import { ArticleService } from '../../core/services/article/article.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { FavoriteService } from '../../core/services/favorite/favorite.service';
import { MessageService } from '../../core/services/message/message.service';
import { ReportService } from '../../core/services/report/report.service';
import { UiToastService } from '../../core/services/toast/ui-toast.service';
import { APP_ASSETS } from '../../core/constants/app-assets';
import { MESSAGE_TEXT } from '../../core/constants/message-text';
import { ARTICLE_SALE_STATUS, TAG_STATUS_VARIANT } from '../../core/constants/status';
import { buyArticleWithToast } from '../../core/utils/article-actions';
import { ActionModalComponent } from '../../shared/components/action-modal/action-modal.component';
import { ValoracionModalComponent } from '../../shared/components/valoracion-modal/valoracion-modal';
import { TagComponent, TagVariant } from '../../shared/ui/tag/tag.component';
import { UiButtonComponent } from '../../shared/ui/button/ui-button.component';
import { UiFavoriteButtonComponent } from '../../shared/ui/favorite-button/ui-favorite-button.component';
import { UiIconButtonComponent } from '../../shared/ui/icon-button/ui-icon-button.component';
import { UiImageComponent } from '../../shared/ui/image/ui-image.component';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ActionModalComponent,
    ValoracionModalComponent,
    UiButtonComponent,
    UiFavoriteButtonComponent,
    UiIconButtonComponent,
    UiImageComponent,
    TagComponent,
  ],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.css'
})
export class ArticleDetail implements OnInit {
  protected readonly text = MESSAGE_TEXT.articleDetail;
  protected readonly saleStatus = ARTICLE_SALE_STATUS;
  isFavorite = signal(false);
  actionModalType = signal<'chat' | 'report' | null>(null);

  // OBJETO PRINCIPAL
  article: Article | null = null;

  // IMAGEN DE RESERVA POR SI NO FUNCIONA LA URL
  defaultImage: string = APP_ASSETS.articleFallback;

  // INYECCIÓN DEL SERVICIO REPLICADA + LECTOR DE RUTAS + DETECTOR DE CAMBIOS
  constructor(
    private articleService: ArticleService,
    private favoriteService: FavoriteService,
    private messageService: MessageService,
    private reportService: ReportService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastService: UiToastService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadBackendArticle();
  }

  // CARGA DINÁMICA DE CATÁLOGO
  loadBackendArticle() {

    const articleId = Number(this.route.snapshot.paramMap.get('id'));

    if (articleId) {
      this.articleService.getArticleById(articleId).subscribe({
        next: (data) => {
          // FORZAMOS LA ASIGNACIÓN LIMPIA
          const resultado = Array.isArray(data) ? data[0] : data;
          this.article = { ...resultado };
          this.isFavorite.set(false);

          if (this.article && (!this.article.foto || this.article.foto.trim() === '')) {
            this.article.foto = this.defaultImage;
          }

          this.cdr.detectChanges();
        },
        error: (err) => console.error(err)
      });

    } else {
      console.warn({ articleId });
    }
  }

  getSaleStatusVariant(): TagVariant {
    if (!this.article) {
      return TAG_STATUS_VARIANT.neutral;
    }

    if (this.article.estado_venta === ARTICLE_SALE_STATUS.reserved) {
      return TAG_STATUS_VARIANT.brand;
    }

    if (this.article.estado_venta === ARTICLE_SALE_STATUS.sold) {
      return TAG_STATUS_VARIANT.dark;
    }

    return TAG_STATUS_VARIANT.neutral;
  }

  // 1. ACCIÓN: COMPRA DIRECTA
  buyArticle() {
    if (!this.article || !this.article.id) return;

    const userId = this.requireLoggedUser();

    if (!userId) {
      return;
    }

    void buyArticleWithToast({
      articleService: this.articleService,
      toastService: this.toastService,
      articleId: this.article.id,
      onSuccess: () => {
        this.setArticleSaleStatus(ARTICLE_SALE_STATUS.sold);
      },
    });
  }

  // 2. ACCIÓN: ABRIR CHAT / MENSAJERÍA
  sendMessage() {
    if (!this.article) return;

    const emisor_id = this.requireLoggedUser();

    if (!emisor_id) {
      return;
    }

    if (emisor_id === this.article.perfil_id) {
      this.toastService.warning(MESSAGE_TEXT.articleDetail.ownConversationError);
      return;
    }

    this.actionModalType.set('chat');
  }

  // 3. ACCIÓN: REPORTAR ANUNCIO / MODERACIÓN
  reportListing() {
    if (!this.article) return;

    const denunciante_id = this.authService.getCurrentUserId();

    if (!denunciante_id) {
      this.toastService.warning(MESSAGE_TEXT.articleDetail.actionLoginRequired);
      return;
    }

    this.actionModalType.set('report');
  }

  closeActionModal(): void {
    this.actionModalType.set(null);
  }

  submitActionModal(value: string): void {
    if (this.actionModalType() === 'chat') {
      this.submitSellerMessage(value);
      return;
    }

    if (this.actionModalType() === 'report') {
      this.submitReport(value);
    }
  }

  getActionModalTitle(): string {
    return this.actionModalType() === 'chat'
      ? MESSAGE_TEXT.articleDetail.chatModalTitle
      : MESSAGE_TEXT.articleDetail.reportModalTitle;
  }

  getActionModalTextareaLabel(): string {
    return this.actionModalType() === 'chat'
      ? MESSAGE_TEXT.articleDetail.chatMessageLabel
      : MESSAGE_TEXT.articleDetail.reportReasonLabel;
  }

  getActionModalPlaceholder(): string {
    return this.actionModalType() === 'chat'
      ? MESSAGE_TEXT.articleDetail.chatMessagePlaceholder
      : MESSAGE_TEXT.articleDetail.reportReasonPlaceholder;
  }

  getActionModalSubmitLabel(): string {
    return this.actionModalType() === 'chat'
      ? MESSAGE_TEXT.articleDetail.chatSubmitLabel
      : MESSAGE_TEXT.articleDetail.reportSubmitLabel;
  }

  private submitSellerMessage(texto: string): void {
    if (!this.article) return;

    const emisor_id = this.authService.getCurrentUserId();

    if (!emisor_id) {
      this.toastService.warning(MESSAGE_TEXT.articleDetail.actionLoginRequired);
      return;
    }

    this.messageService.sendMessage(texto, emisor_id, this.article.perfil_id, this.article.id!).subscribe({
      next: (res) => {
        this.closeActionModal();
        this.router.navigate(['/messages/conversation-thread', res.conversationId]);
      },
      error: (err) => this.toastService.error(err.error?.message || MESSAGE_TEXT.articleDetail.sendMessageError)
    });
  }

  private submitReport(motivo: string): void {
    if (!this.article) return;

    const denunciante_id = this.authService.getCurrentUserId();

    if (!denunciante_id) {
      this.toastService.warning(MESSAGE_TEXT.articleDetail.actionLoginRequired);
      return;
    }

    if (!motivo.trim()) {
      this.toastService.warning(MESSAGE_TEXT.articleDetail.reportReasonRequired);
      return;
    }

    this.reportService.createReport(motivo.trim(), denunciante_id, this.article.perfil_id, this.article.id!).subscribe({
      next: (res) => {
        this.closeActionModal();
        this.toastService.success(MESSAGE_TEXT.articleDetail.reportSuccess);
      },
      error: () => this.toastService.error(MESSAGE_TEXT.articleDetail.sendReportError)
    });
  }

  // 4. ACCIÓN: AÑADIR A FAVORITOS
  addToFavorites() {
    if (!this.article || !this.article.id) return;

    const mi_perfil_id = this.authService.getCurrentUserId();

    if (!mi_perfil_id) {
      this.toastService.warning(MESSAGE_TEXT.articleDetail.actionLoginRequired);
      return;
    }
    
    this.favoriteService.addFavorite(mi_perfil_id, this.article.id).subscribe({
      next: (res) => {
        this.isFavorite.set(true);
        this.toastService.success(res.message);
      },
      error: (err) => this.toastService.error(err.error?.message || MESSAGE_TEXT.articleDetail.favoriteError)
    });
  }

  // 5. ACCIÓN: RESERVAR
  reserveArticle() {
    if (!this.article || !this.article.id) return;

    const userId = this.requireLoggedUser();

    if (!userId) {
      return;
    }

    this.articleService.reserveArticle(this.article.id).subscribe({
      next: () => {
        this.setArticleSaleStatus(ARTICLE_SALE_STATUS.reserved);
        this.toastService.success(MESSAGE_TEXT.articleDetail.reserveSuccess);
      },
      error: (err) => {
        const message = err.status === 400
          ? MESSAGE_TEXT.articleDetail.reserveUnavailable
          : MESSAGE_TEXT.articleDetail.operationError;

        this.toastService.error(message);
      }
    });
  }

  // 6.LÓGICA AUXILIAR PARA VALORACIONES: ¿ES EL USUARIO ACTUAL EL COMPRADOR?
  isCurrentUserTheBuyer(): boolean {
    if (!this.article) return false;
    return this.authService.getCurrentUserId() === this.article.perfil_id; 
  }

  private requireLoggedUser(): number | null {
    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      this.toastService.warning(MESSAGE_TEXT.articleDetail.actionLoginRequired);
      return null;
    }

    return userId;
  }

  private setArticleSaleStatus(status: Article['estado_venta']): void {
    if (!this.article) {
      return;
    }

    this.article = {
      ...this.article,
      estado_venta: status,
    };
    this.cdr.detectChanges();
  }
}

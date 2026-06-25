import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Article } from '../../core/models/article/article.model';
import { ArticleService } from '../../core/services/article/article.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { FavoriteService } from '../../core/services/favorite/favorite.service';
import { MessageService } from '../../core/services/message/message.service';
import { ReportService } from '../../core/services/report/report.service';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.css'
})
export class ArticleDetail implements OnInit {

  // OBJETO PRINCIPAL
  article: Article | null = null;

  // IMAGEN DE RESERVA POR SI NO FUNCIONA LA URL
  defaultImage: string = 'https://c8.alamy.com/comp/2YBTHP5/the-lego-logo-made-with-plastic-bricks-surrounded-by-colorful-flowers-also-made-with-bricks-2YBTHP5.jpg';

  // INYECCIÓN DEL SERVICIO REPLICADA + LECTOR DE RUTAS + DETECTOR DE CAMBIOS
  constructor(
    private articleService: ArticleService,
    private favoriteService: FavoriteService,
    private messageService: MessageService,
    private reportService: ReportService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadBackendArticle();
  }

  // CARGA DINÁMICA BASADA EN TU MÉTODO DE CATÁLOGO
  loadBackendArticle() {

    const articleId = Number(this.route.snapshot.paramMap.get('id'));

    console.log('🔍 ID detectado en la URL:', articleId);

    if (articleId) {
      console.log('Intentando llamar al servicio para el ID:', articleId);

      this.articleService.getArticleById(articleId).subscribe({
        next: (data) => {
          console.log('ÉXITO: Datos recibidos:', data);

          // FORZAMOS LA ASIGNACIÓN LIMPIA
          const resultado = Array.isArray(data) ? data[0] : data;
          this.article = { ...resultado };

          if (this.article && (!this.article.foto || this.article.foto.trim() === '')) {
            this.article.foto = this.defaultImage;
          }

          console.log('Variable article final:', this.article);

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('ERROR:', err);
        }
      });

    } else {
      console.warn('No se ha detectado ningún ID válido en la ruta.');
    }
  }

  // CAPTURAR FALLO SI NO EXISTE FOTO EN LA BBDD
  onImageError(event: Event) {
    const element = event.target as HTMLImageElement;
    element.src = this.defaultImage;
  }

  // 1. ACCIÓN: COMPRA DIRECTA
  buyArticle() {
    if (!this.article || !this.article.id) return;
    if (!this.article || !this.article.id) return;
    this.articleService.buyArticle(this.article.id).subscribe({
      next: (res) => alert(res.message),
      error: (err) => alert(err.error.message)
    });
  }

  // 2. ACCIÓN: ABRIR CHAT / MENSAJERÍA
  sendMessage() {
    const texto = prompt("Escribe tu mensaje para el vendedor:");
    if (!texto || !this.article) return;

    const emisor_id = this.authService.getCurrentUserId();

    if (!emisor_id) {
      alert('Debes iniciar sesión para enviar un mensaje');
      return;
    }

    if (emisor_id === this.article.perfil_id) {
      alert('No puedes iniciar una conversación contigo mismo');
      return;
    }

    this.messageService.sendMessage(texto, emisor_id, this.article.perfil_id, this.article.id!).subscribe({
      next: (res) => this.router.navigate(['/messages/conversation-thread', res.conversationId]),
      error: (err) => alert(err.error?.message || 'Error al enviar el mensaje')
    });
  }

  // 3. ACCIÓN: REPORTAR ANUNCIO / MODERACIÓN
  reportListing() {
    const motivo = prompt("Motivo del reporte:");
    if (!motivo || !this.article) return;

    const denunciante_id = 1; // TU ID
    this.reportService.createReport(motivo, denunciante_id, this.article.perfil_id, this.article.id!).subscribe({
      next: (res) => alert(res.message),
      error: (err) => alert('Error al enviar el reporte')
    });
  }

  // 4. ACCIÓN: AÑADIR A FAVORITOS
  addToFavorites() {
    if (!this.article || !this.article.id) return;
    const mi_perfil_id = 1; // REEMPLAZA CON EL ID DE TU SESIÓN ACTUAL
    
    this.favoriteService.addFavorite(mi_perfil_id, this.article.id).subscribe({
      next: (res) => alert(res.message),
      error: (err) => alert(err.error.message || 'Error al añadir a favoritos')
    });
  }

  // 5. ACCIÓN: RESERVAR
  reserveArticle() {
    if (!this.article || !this.article.id) return;
    this.articleService.reserveArticle(this.article.id).subscribe({
      next: (res) => alert(res.message),
      error: (err) => alert(err.error.message)
    });
  }
}

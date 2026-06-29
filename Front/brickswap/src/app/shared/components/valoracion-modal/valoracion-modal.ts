import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ReviewService } from '../../../core/services/review/review.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MESSAGE_TEXT } from '../../../core/constants/message-text';
import { UiToastService } from '../../../core/services/toast/ui-toast.service';

@Component({
  selector: 'app-valoracion-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './valoracion-modal.html',
  styleUrls: ['./valoracion-modal.css']
})
export class ValoracionModalComponent {
  @Input() articleId!: number;
  @Input() vendedorId!: number;

  puntuacion: number = 5;
  comentario: string = '';

  constructor(
    private reviewService: ReviewService,
    private authService: AuthService,
    private toastService: UiToastService
  ) { }

  guardarValoracion() {
    const emisorId = this.authService.getCurrentUserId();
    if (!emisorId) {
      this.toastService.warning(MESSAGE_TEXT.review.loginRequired);
      return;
    }

    const reviewData = {
      puntuacion: this.puntuacion,
      comentario: this.comentario,
      emisor_id: emisorId,
      receptor_id: this.vendedorId,
      articulo_id: this.articleId
    };

    this.reviewService.createReview(reviewData).subscribe({
      next: (res) => {
        this.toastService.success(res.message);
      },
      error: (err) => {
        this.toastService.error(err.error?.message || MESSAGE_TEXT.review.sendError);
      }
    });
  }
}

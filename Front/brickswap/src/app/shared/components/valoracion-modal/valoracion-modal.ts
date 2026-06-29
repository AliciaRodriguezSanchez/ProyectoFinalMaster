import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ReviewService } from '../../../core/services/review/review.service';
import { AuthService } from '../../../core/services/auth/auth.service';

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
    private authService: AuthService
  ) { }

  guardarValoracion() {
    const emisorId = this.authService.getCurrentUserId();
    if (!emisorId) {
      alert("Debes estar logueado para valorar.");
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
        alert(res.message);
      },
      error: (err) => {
        alert(err.error?.message || "Error al enviar la valoración");
      }
    });
  }
}

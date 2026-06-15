import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-valoracion-modal',
  templateUrl: './valoracion-modal.html',
  styleUrls: ['./valoracion-modal.css']
})
export class ValoracionModalComponent {
  @Input() articleId!: number;
  @Input() vendedorId!: number;

  constructor() { }

  guardarValoracion() {
    console.log("Guardando valoración para el artículo:", this.articleId);
    console.log("Valorando al usuario:", this.vendedorId);
    // PENDIENTE CONECTAR A API
  }
}

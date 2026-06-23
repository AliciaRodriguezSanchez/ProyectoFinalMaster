import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-view',
  imports: [FormsModule, CommonModule],
  templateUrl: './report-view.component.html',
  styleUrl: './report-view.component.css',
})
export class ReportViewComponent {

  reporte = input<any>();
  estado= input<string>('Pendiente');
  @Output() onClose = new EventEmitter<void>();
  @Output() onResolve = new EventEmitter<{id: number, estado: string, resolucion: string}>();

  resolucionText: string ='';

  ngOnInit(){
    console.log(this.reporte);
  }

  cerrarModal(){
    this.onClose.emit();
  }

  resolver(accion: 'aprobar' | 'retirar'){
    if (!this.resolucionText.trim()) return;

    const estadoReporte = accion === 'aprobar' ? 'Revisado_Mantenido' : 'Revisado_Retirado';

    this.onResolve.emit({
      id: this.reporte().id,
      estado: estadoReporte,
      resolucion: this.resolucionText
    })
  }
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';

import { ActionModalComponent, ActionModalDetail } from '../action-modal/action-modal.component';

@Component({
  selector: 'app-report-view',
  imports: [CommonModule, ActionModalComponent],
  templateUrl: './report-view.component.html',
  styleUrl: './report-view.component.css',
})
export class ReportViewComponent {

  reporte = input<any>();
  estado= input<string>('Pendiente');
  @Output() onClose = new EventEmitter<void>();
  @Output() onResolve = new EventEmitter<{id: number, estado: string, resolucion: string, estado_revision: string}>();

  readonly modalTitle = 'Panel de detalle del reporte';
  readonly decisionLabel = 'Motivo de la decisión';
  readonly decisionPlaceholder = 'Explica el motivo de la decisión tomada...';
  readonly requiredError = 'El motivo de la decisión es obligatorio';
  readonly approveLabel = 'Aprobar artículo';
  readonly retireLabel = 'Retirar artículo';
  readonly closeLabel = 'Cerrar';

  cerrarModal(){
    this.onClose.emit();
  }

  get reportDetails(): ActionModalDetail[] {
    const reporte = this.reporte();

    return [
      { label: 'Artículo', value: reporte?.title },
      { label: 'Motivo', value: reporte?.reason },
      { label: 'Reportado por', value: reporte?.customer },
      { label: 'Fecha y hora', value: this.formatReportDate(reporte?.time) },
    ];
  }

  get resolutionDetails(): ActionModalDetail[] {
    return [
      ...this.reportDetails,
      { label: 'Resolución aplicada', value: this.reporte()?.resolution },
    ];
  }

  resolver(accion: 'aprobar' | 'retirar', resolucion: string){
    const cleanResolution = resolucion.trim();

    if (!cleanResolution) return;

    const estadoReporte = accion === 'aprobar' ? 'Revisado_Mantenido' : 'Revisado_Retirado';
    const estadoArticulo = accion === 'aprobar' ? 'Publicado' : 'Rechazado';
 
    this.onResolve.emit({
      id: this.reporte().id,
      estado: estadoReporte,
      resolucion: cleanResolution,
      estado_revision: estadoArticulo
    })
  }

  private formatReportDate(date: string | Date | null | undefined): string {
    if (!date) {
      return '';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(parsedDate);
  }
}

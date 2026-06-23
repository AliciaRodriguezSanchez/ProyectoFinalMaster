import { Component, EventEmitter, input, Output } from '@angular/core';
import { IPendingTable } from '../../interfaces/ipending-table.interface';
import { CommonModule } from '@angular/common';
import { IUsersTable } from '../../interfaces/iusers-table.interface';
import { ReportViewComponent } from '../components/report-view/report-view.component';

export type TableItem = IUsersTable | IPendingTable;

@Component({
  selector: 'app-table',
  imports: [CommonModule, ReportViewComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  typeTable = input<string>('pendientes');
  data = input<TableItem[]>([]); 

  @Output() onGuardarResolucion = new EventEmitter<{id: number, estado: string, resolucion: string}>();
  @Output() ordenarEvent = new EventEmitter<void>();

  emitirOrden() {
    console.log("Clic detectado en botón ordenar"); 
    this.ordenarEvent.emit();
  }

  mostrarModal: boolean = false;
  reporteSeleccionado: any = null;

  mostrarReporte(item: any){
    this.reporteSeleccionado = item;
    this.mostrarModal = true ;
  }

  cerrarModal(){
    this.mostrarModal = false;
    this.reporteSeleccionado = null;
  }

  procesarResolucion(datosResolucion: {id: number, estado: string, resolucion: string}){
    this.onGuardarResolucion.emit(datosResolucion);
    this.cerrarModal();
  }


}

import { Component, EventEmitter, input, Output } from '@angular/core';
import { IPendingTable } from '../../interfaces/ipending-table.interface';
import { CommonModule } from '@angular/common';
import { IUsersTable } from '../../interfaces/iusers-table.interface';
import { IArticle } from '../../interfaces/iarticles.interface';
import { ReportViewComponent } from '../components/report-view/report-view.component';
import { TagComponent } from '../ui/tag/tag.component';
import { UiSelectComponent, UiSelectOption } from '../ui/select/ui-select.component';
import { UiSwitchComponent } from '../ui/switch/ui-switch.component';

export type TableItem = IUsersTable | IPendingTable | IArticle;

@Component({
  selector: 'app-table',
  imports: [CommonModule, ReportViewComponent, TagComponent, UiSelectComponent, UiSwitchComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  typeTable = input<string>('pendientes');
  data = input<TableItem[]>([]); 
  sortLabel = input('Más reciente');
  roleSelectResetKey = input(0);
  roleOptions: UiSelectOption[] = [
    { label: 'Usuario', value: '1' },
    { label: 'Moderador', value: '2' },
    { label: 'Administrador', value: '3' },
  ];

  @Output() onGuardarResolucion = new EventEmitter<{id: number, estado: string, resolucion: string, estado_revision:string}>();
  @Output() ordenarEvent = new EventEmitter<void>();
  @Output() actionClick = new EventEmitter<any>();
  @Output() roleChange = new EventEmitter<{ id: number, newRole: string }>();
  @Output() deleteClick = new EventEmitter<any>();
  @Output() promotionChange = new EventEmitter<{ id: number, inPromotion: boolean }>();

  headerIcon(): string {
    const icons: Record<string, string> = {
      Pendiente: 'bi-exclamation-triangle',
      Revisado_Mantenido: 'bi-check-circle',
      Revisado_Retirado: 'bi-x-circle',
      usuarios: 'bi-people',
      promotions: 'bi-star',
    };

    return icons[this.typeTable()] || 'bi-list-ul';
  }

  headerTitle(): string {
    const titles: Record<string, string> = {
      Pendiente: 'Pendientes',
      Revisado_Mantenido: 'Aceptados',
      Revisado_Retirado: 'Retirados',
      usuarios: `${this.data().length} usuarios`,
      promotions: `${this.data().length} artículos`,
    };

    return titles[this.typeTable()] || 'Listado';
  }

  getRoleSelectValue(roleId: number | string | null | undefined): string {
    const numericRoleId = Number(roleId);

    return [1, 2, 3].includes(numericRoleId) ? String(numericRoleId) : '1';
  }

  getRoleLabel(roleId: number | string | null | undefined): string {
    const labels: Record<number, string> = {
      1: 'Usuario',
      2: 'Moderador',
      3: 'Administrador',
    };

    return labels[Number(this.getRoleSelectValue(roleId))];
  }

  isArticleInPromotion(value: number | boolean | null | undefined): boolean {
    return value === true || value === 1;
  }

  emitPromotionChange(item: IArticle, inPromotion: boolean): void {
    if (!item.id) {
      return;
    }

    this.promotionChange.emit({ id: item.id, inPromotion });
  }

  emitirOrden() {
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

  procesarResolucion(datosResolucion: {id: number, estado: string, resolucion: string, estado_revision:string}){
    this.onGuardarResolucion.emit(datosResolucion);
    this.cerrarModal();
  }


}

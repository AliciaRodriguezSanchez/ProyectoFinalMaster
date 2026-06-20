import { Component, input } from '@angular/core';
import { IPendingTable } from '../../interfaces/ipending-table.interface';
import { IUsersTable } from '../../interfaces/iusers-table.interface';

export type TableItem = IUsersTable | IPendingTable;

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  typeTable = input<'pendientes' | 'usuarios'>('pendientes');
  data = input<TableItem[]>([]); 

  getBorderClass(type: string | undefined, isFirst: boolean): string {
    if (!isFirst) return 'border-transparent';
    if (type === 'pendientes') return 'border-warning';
    if (type === 'usuarios') return 'border-success'; 
    return 'border-transparent';
  }

}

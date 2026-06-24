import { Component, signal } from '@angular/core';
import { PillComponent } from '../../shared/ui/pill/pill.component';
import { OrdenarListaComponent, SortOrder } from '../../shared/ui/ordenar-lista/ordenar-lista.component';
import { CajaMensajeComponent, MessageStatus } from '../../shared/caja-mensaje/caja-mensaje.component';

@Component({
  selector: 'app-messages',
  imports: [PillComponent, OrdenarListaComponent, CajaMensajeComponent],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class MessagesPage {
  selectedTab = signal<string>('all')

  sortOrder = signal<SortOrder>('newest')
  
  messages = signal<any[]>([])

  loadData(){

  }

  onStatusChanged(id: number, status: MessageStatus) {
    // 1. Llamar a la API para persistir
    // this.messagesService.updateStatus(id, status).subscribe(...)

    // 2. Actualizar el signal local para que el tab filtre correctamente
    this.messages.update(msgs =>
      msgs.map(m => m.id === id ? { ...m, status } : m)
    );
  }

  setOrder(order: SortOrder) {
    this.sortOrder.set(order);
    this.loadData(); // aquí tu llamada a backend
  }
}

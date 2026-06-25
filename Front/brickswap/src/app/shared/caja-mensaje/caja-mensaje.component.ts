import { Component, effect, input, output, signal } from '@angular/core';

export type MessageStatus = 'Leído' | 'Sin leer' | 'Pendiente' | 'Resuelto';

@Component({
  selector: 'app-caja-mensaje',
  imports: [],
  templateUrl: './caja-mensaje.component.html',
  styleUrl: './caja-mensaje.component.css',
   host: {
    class: 'd-block w-100'
  }
})
export class CajaMensajeComponent {
  name = input.required<string>();
  product = input.required<string>();
  timeAgo = input.required<string>();
  status = input.required<MessageStatus>();
  currentStatus = signal<MessageStatus>('Sin leer');
  lastMsg = input<string>('');
  previewLength = input<number>(80);
  showStatusSelect = input<boolean>(true);

  statusChanged = output<MessageStatus>();

  constructor(){
    effect(() => {
      this.currentStatus.set(this.status())
    })
  }

  get messagePreview(): string {
    const msg = this.lastMsg();
    const len = this.previewLength();
    if (!msg) return '';
    return msg.length > len ? msg.slice(0, len) + '...' : msg;
  }

  get initials(): string {
    return this.name()
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  onStatusChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as MessageStatus;
    this.currentStatus.set(value);
    this.statusChanged.emit(value);
  }

  readonly statusOptions: MessageStatus[] = ['Sin leer', 'Leído', 'Pendiente', 'Resuelto'];
}

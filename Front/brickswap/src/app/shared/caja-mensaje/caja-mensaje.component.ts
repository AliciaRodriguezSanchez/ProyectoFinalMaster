import { Component, effect, input, linkedSignal, output, signal } from '@angular/core';
import { StatusLabelPipe } from '../pipes/status-label-pipe';

export type MessageStatus =  'unreaded' | 'readed' | 'pending' | 'resolved';

@Component({
  selector: 'app-caja-mensaje',
  imports: [StatusLabelPipe],
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
  currentStatus = linkedSignal(() => this.status());
  lastMsg = input<string>('');
  previewLength = input<number>(80);

  statusChanged = output<MessageStatus>();

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
  event.stopPropagation();
  const select = event.target as HTMLSelectElement;
  this.currentStatus.set(select.value as MessageStatus);
  this.statusChanged.emit(select.value as MessageStatus);
  }

  onSelectClick(event: Event): void {
    event.stopPropagation(); 
    event.preventDefault();   
  }


  readonly statusOptions: MessageStatus[] = ['unreaded', 'readed', 'pending', 'resolved'];
}

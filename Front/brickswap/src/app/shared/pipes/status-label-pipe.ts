import { Pipe, PipeTransform } from '@angular/core';
import { MessageStatus } from '../../shared/caja-mensaje/caja-mensaje.component';

const STATUS_LABEL: Record<MessageStatus, string> = {
  unreaded: 'Sin leer',
  readed:   'Leído',
  pending:  'Pendiente',
  resolved: 'Resuelto',
};

@Pipe({ name: 'statusLabel', standalone: true })
export class StatusLabelPipe implements PipeTransform {
  transform(value: MessageStatus): string {
    return STATUS_LABEL[value] ?? value;
  }
}

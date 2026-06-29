import { Injectable, signal } from '@angular/core';

export type UiToastType = 'error' | 'success' | 'info' | 'warning';

export interface UiToastMessage {
  id: number;
  message: string;
  type: UiToastType;
}

@Injectable({
  providedIn: 'root',
})
export class UiToastService {
  messages = signal<UiToastMessage[]>([]);
  private nextId = 1;

  show(message: string, type: UiToastType = 'info'): void {
    const toast = {
      id: this.nextId,
      message,
      type,
    };

    this.nextId += 1;
    this.messages.update((messages) => [
      ...messages.filter((message) => message.type !== type),
      toast,
    ]);

    setTimeout(() => this.remove(toast.id), 4000);
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  remove(id: number): void {
    this.messages.update((messages) => messages.filter((message) => message.id !== id));
  }
}

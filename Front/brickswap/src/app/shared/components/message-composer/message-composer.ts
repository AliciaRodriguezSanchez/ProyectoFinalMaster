import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-message-composer',
  standalone: false,
  templateUrl: './message-composer.html',
  styleUrl: './message-composer.css',
})
export class MessageComposerComponent {
  @Output() messageSent = new EventEmitter<string>();

  message = '';

  sendMessage(): void {
    const text = this.message.trim();

    if (!text) {
      return;
    }

    this.messageSent.emit(text);
    this.message = '';
  }
}

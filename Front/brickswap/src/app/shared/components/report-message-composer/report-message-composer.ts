import { Component, EventEmitter, Output } from '@angular/core';

import { MESSAGE_TEXT } from '../../../core/constants/message-text';
import { MessageComposerComponent } from '../message-composer/message-composer';

@Component({
  selector: 'app-report-message-composer',
  imports: [MessageComposerComponent],
  templateUrl: './report-message-composer.html',
  styleUrl: './report-message-composer.css',
})
export class ReportMessageComposerComponent {
  protected readonly text = MESSAGE_TEXT.messages;

  @Output() messageSent = new EventEmitter<string>();

  onMessageSent(message: string): void {
    this.messageSent.emit(message);
  }
}

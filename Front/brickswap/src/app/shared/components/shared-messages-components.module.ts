import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MessageActionsComponent } from './message-actions/message-actions';
import { MessageComposerComponent } from './message-composer/message-composer';
import { MessageConversationHeaderComponent } from './message-conversation-header/message-conversation-header';
import { MessageEmptyStateComponent } from './message-empty-state/message-empty-state';
import { MessageThreadComponent } from './message-thread/message-thread';
import { ReportMessageComposerComponent } from './report-message-composer/report-message-composer';

@NgModule({
  exports: [
    MessageActionsComponent,
    MessageComposerComponent,
    MessageConversationHeaderComponent,
    MessageEmptyStateComponent,
    MessageThreadComponent,
    ReportMessageComposerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MessageActionsComponent,
    MessageComposerComponent,
    MessageConversationHeaderComponent,
    MessageEmptyStateComponent,
    MessageThreadComponent,
    ReportMessageComposerComponent,
  ],
})
export class SharedMessagesComponentsModule {}

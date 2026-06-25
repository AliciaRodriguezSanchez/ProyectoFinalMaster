import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MessageActionsComponent } from './message-actions/message-actions';
import { MessageComposerComponent } from './message-composer/message-composer';
import { MessageConversationHeaderComponent } from './message-conversation-header/message-conversation-header';
import { MessageEmptyStateComponent } from './message-empty-state/message-empty-state';
import { MessageThreadComponent } from './message-thread/message-thread';

@NgModule({
  exports: [
    MessageActionsComponent,
    MessageComposerComponent,
    MessageConversationHeaderComponent,
    MessageEmptyStateComponent,
    MessageThreadComponent,
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
  ],
})
export class SharedMessagesComponentsModule {}

import { NgModule } from '@angular/core';

import { MessageActionsComponent } from './message-actions/message-actions';
import { MessageComposerComponent } from './message-composer/message-composer';
import { MessageConversationHeaderComponent } from './message-conversation-header/message-conversation-header';
import { MessageEmptyStateComponent } from './message-empty-state/message-empty-state';
import { MessageThreadComponent } from './message-thread/message-thread';
import { ReportMessageComposerComponent } from './report-message-composer/report-message-composer';

//Módulo agrupador para los componentes de mensajes.
//importar uno a uno todos estos componentes
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
    MessageActionsComponent,
    MessageComposerComponent,
    MessageConversationHeaderComponent,
    MessageEmptyStateComponent,
    MessageThreadComponent,
    ReportMessageComposerComponent,
  ],
})
export class SharedMessagesComponentsModule {}

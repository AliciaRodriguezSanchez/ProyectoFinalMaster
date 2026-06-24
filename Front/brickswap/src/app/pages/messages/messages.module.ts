import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedMessagesComponentsModule } from '../../shared/components/shared-messages-components.module';
import { ConversationPage } from './conversation/conversation';
import { MessagesPage } from './messages';

const routes: Routes = [
  {
    path: '',
    component: MessagesPage,
  },
  {
    path: 'conversation-thread/:conversationId',
    component: ConversationPage,
  },
  {
    path: 'conversation/:articleId',
    component: ConversationPage,
  },
  {
    // Compatibilidad temporal con URLs antiguas. El userId real sale del token.
    path: 'conversation/:articleId/:userId',
    component: ConversationPage,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedMessagesComponentsModule, MessagesPage, ConversationPage],
})
export class MessagesModule {}

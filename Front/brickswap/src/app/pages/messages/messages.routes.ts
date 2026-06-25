import { Routes } from '@angular/router';

import { ConversationPage } from './conversation/conversation';
import { MessagesPage } from './messages';

export const MESSAGES_ROUTES: Routes = [
  {
    path: '',
    component: MessagesPage,
  },
  {
    path: 'conversation-thread/:conversationId',
    component: ConversationPage,
  },
  {
    path: 'conversation-report/:reportId',
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

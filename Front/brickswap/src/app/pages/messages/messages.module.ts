import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedMessagesComponentsModule } from '../../shared/components/shared-messages-components.module';
import { MessagesPage } from './messages';

const routes: Routes = [
  {
    path: '',
    component: MessagesPage,
  },
];

@NgModule({
  declarations: [MessagesPage],
  imports: [CommonModule, RouterModule.forChild(routes), SharedMessagesComponentsModule],
})
export class MessagesModule {}

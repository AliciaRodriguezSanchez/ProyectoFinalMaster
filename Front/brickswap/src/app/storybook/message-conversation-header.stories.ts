import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideRouter } from '@angular/router';

import { MessageConversationHeaderComponent } from '../shared/components/message-conversation-header/message-conversation-header';
import { brickImage } from './storybook.data';

const meta: Meta<MessageConversationHeaderComponent> = {
  title: 'Shared/Components/Message Conversation Header',
  component: MessageConversationHeaderComponent,
  parameters: {
    canvasWidth: '760px'
  },
  decorators: [applicationConfig({ providers: [provideRouter([])] })],
  argTypes: {
    back: { action: 'back' }
  },
  args: {
    contact: {
      name: 'Alicia Rodríguez',
      initial: 'A'
    },
    product: {
      id: 10420,
      title: 'LEGO Star Wars X-Wing',
      price: 149.99,
      imageUrl: brickImage
    }
  }
};

export default meta;

type Story = StoryObj<MessageConversationHeaderComponent>;

export const Default: Story = {};

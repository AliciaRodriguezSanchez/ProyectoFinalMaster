import type { Meta, StoryObj } from '@storybook/angular';

import { MessageThreadComponent } from '../shared/components/message-thread/message-thread';

const meta: Meta<MessageThreadComponent> = {
  title: 'Shared/Components/Message Thread',
  component: MessageThreadComponent,
  parameters: {
    canvasWidth: '640px'
  },
  args: {
    messages: [
      {
        id: 1,
        type: 'text',
        text: 'Hola, me interesa el producto.',
        time: '10:30',
        mine: false
      },
      {
        id: 2,
        type: 'priceProposal',
        title: 'Propuesta de precio',
        amount: 120,
        time: '10:32',
        mine: true
      }
    ]
  }
};

export default meta;

type Story = StoryObj<MessageThreadComponent>;

export const Default: Story = {};

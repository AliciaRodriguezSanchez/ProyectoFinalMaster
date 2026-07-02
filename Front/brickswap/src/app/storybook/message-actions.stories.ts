import type { Meta, StoryObj } from '@storybook/angular';

import { MessageActionsComponent } from '../shared/components/message-actions/message-actions';

const meta: Meta<MessageActionsComponent> = {
  title: 'Shared/Components/Message Actions',
  component: MessageActionsComponent,
  parameters: {
    canvasWidth: '520px'
  },
  argTypes: {
    actionSelected: { action: 'actionSelected' }
  },
  args: {
    showPrice: true,
    showDelivery: true,
    showBuy: true
  }
};

export default meta;

type Story = StoryObj<MessageActionsComponent>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/angular';

import { MessageEmptyStateComponent } from '../shared/components/message-empty-state/message-empty-state';

const meta: Meta<MessageEmptyStateComponent> = {
  title: 'Shared/Components/Message Empty State',
  component: MessageEmptyStateComponent,
  parameters: {
    canvasWidth: '520px'
  },
  args: {
    text: 'Inicia la conversación enviando un mensaje, haciendo una oferta de precio o proponiendo un método de entrega.'
  }
};

export default meta;

type Story = StoryObj<MessageEmptyStateComponent>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/angular';

import { MessageComposerComponent } from '../shared/components/message-composer/message-composer';

const meta: Meta<MessageComposerComponent> = {
  title: 'Shared/Components/Message Composer',
  component: MessageComposerComponent,
  parameters: {
    canvasWidth: '520px'
  },
  argTypes: {
    messageSent: { action: 'messageSent' }
  }
};

export default meta;

type Story = StoryObj<MessageComposerComponent>;

export const Default: Story = {};

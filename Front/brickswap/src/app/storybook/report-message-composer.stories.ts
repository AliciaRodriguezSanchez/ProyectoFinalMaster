import type { Meta, StoryObj } from '@storybook/angular';

import { ReportMessageComposerComponent } from '../shared/components/report-message-composer/report-message-composer';

const meta: Meta<ReportMessageComposerComponent> = {
  title: 'Shared/Components/Report Message Composer',
  component: ReportMessageComposerComponent,
  parameters: {
    canvasWidth: '520px'
  },
  argTypes: {
    messageSent: { action: 'messageSent' }
  }
};

export default meta;

type Story = StoryObj<ReportMessageComposerComponent>;

export const Default: Story = {};

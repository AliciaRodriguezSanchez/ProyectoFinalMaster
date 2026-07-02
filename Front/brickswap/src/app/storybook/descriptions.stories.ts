import type { Meta, StoryObj } from '@storybook/angular';

import { DescriptionsComponent } from '../shared/ui/descriptions/descriptions.component';

const meta: Meta<DescriptionsComponent> = {
  title: 'Shared/UI/Descriptions',
  component: DescriptionsComponent,
  parameters: {
    canvasWidth: '520px'
  },
  argTypes: {
    format: { control: 'select', options: ['body', 'label'] }
  },
  args: {
    text: 'Gestiona los elementos de la plataforma BrickSwap',
    format: 'body'
  }
};

export default meta;

type Story = StoryObj<DescriptionsComponent>;

export const Body: Story = {};

export const Label: Story = {
  args: {
    format: 'label'
  }
};

import type { Meta, StoryObj } from '@storybook/angular';

import { TitleComponent } from '../shared/ui/titles/title.component';

const meta: Meta<TitleComponent> = {
  title: 'Shared/UI/Title',
  component: TitleComponent,
  parameters: {
    canvasWidth: '520px'
  },
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] }
  },
  args: {
    text: 'Panel de Administración',
    size: 'large'
  }
};

export default meta;

type Story = StoryObj<TitleComponent>;

export const Large: Story = {};

export const Medium: Story = {
  args: {
    size: 'medium'
  }
};

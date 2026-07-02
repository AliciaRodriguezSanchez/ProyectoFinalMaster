import type { Meta, StoryObj } from '@storybook/angular';

import { PillComponent } from '../shared/ui/pill/pill.component';

const meta: Meta<PillComponent> = {
  title: 'Shared/UI/Pill',
  component: PillComponent,
  parameters: {
    canvasWidth: '260px'
  },
  argTypes: {
    active: { control: 'boolean' },
    selected: { action: 'selected' }
  },
  args: {
    label: 'En promoción',
    value: 'promoted',
    active: true
  }
};

export default meta;

type Story = StoryObj<PillComponent>;

export const Active: Story = {};

export const Inactive: Story = {
  args: {
    active: false
  }
};

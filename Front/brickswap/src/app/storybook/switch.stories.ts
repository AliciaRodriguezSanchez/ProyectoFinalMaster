import type { Meta, StoryObj } from '@storybook/angular';

import { UiSwitchComponent } from '../shared/ui/switch/ui-switch.component';

const meta: Meta<UiSwitchComponent> = {
  title: 'Shared/UI/Switch',
  component: UiSwitchComponent,
  parameters: {
    canvasWidth: '120px'
  },
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    checkedChange: { action: 'checkedChange' }
  },
  args: {
    checked: true,
    disabled: false,
    ariaLabel: 'Artículo en promoción'
  }
};

export default meta;

type Story = StoryObj<UiSwitchComponent>;

export const Active: Story = {};

export const Inactive: Story = {
  args: {
    checked: false
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

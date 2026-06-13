import type { Meta, StoryObj } from '@storybook/angular';

import { UiLogoComponent } from '../shared/ui/logo/ui-logo.component';

const meta: Meta<UiLogoComponent> = {
  title: 'Shared/UI/Logo',
  component: UiLogoComponent,
  args: {
    text: 'BrickSwap',
    imageUrl: '/assets/logo/logo.png'
  }
};

export default meta;

type Story = StoryObj<UiLogoComponent>;

export const Default: Story = {};

export const TextMark: Story = {
  args: {
    imageUrl: ''
  }
};

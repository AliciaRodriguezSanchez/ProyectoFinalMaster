import type { Meta, StoryObj } from '@storybook/angular';

import { UiButtonComponent } from '../shared/ui/button/ui-button.component';

const meta: Meta<UiButtonComponent> = {
  title: 'Shared/UI/Button',
  component: UiButtonComponent,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary']
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    },
    disabled: {
      control: 'boolean'
    },
    showArrow: {
      control: 'boolean'
    }
  },
  args: {
    label: 'Explorar sets',
    variant: 'primary',
    size: 'md',
    disabled: false,
    showArrow: false
  }
};

export default meta;

type Story = StoryObj<UiButtonComponent>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    label: 'Ver novedades',
    variant: 'secondary'
  }
};

export const LargeWithArrow: Story = {
  args: {
    label: 'Comprar ahora',
    size: 'lg',
    showArrow: true
  }
};

export const Disabled: Story = {
  args: {
    label: 'No disponible',
    disabled: true
  }
};

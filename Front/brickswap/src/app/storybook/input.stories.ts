import type { Meta, StoryObj } from '@storybook/angular';

import { UiInputComponent } from '../shared/ui/input/ui-input.component';

const meta: Meta<UiInputComponent> = {
  title: 'Shared/UI/Input',
  component: UiInputComponent,
  parameters: {
    canvasWidth: '360px'
  },
  argTypes: {
    type: { control: 'select', options: ['email', 'password', 'text', 'number'] },
    icon: { control: 'select', options: ['email', 'lock', 'profile', 'currency'] },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' }
  },
  args: {
    label: 'Email',
    type: 'email',
    icon: 'email',
    placeholder: 'usuario@email.com',
    required: true,
    invalid: false,
    errorMessage: 'Campo obligatorio'
  }
};

export default meta;

type Story = StoryObj<UiInputComponent>;

export const Default: Story = {};

export const Numeric: Story = {
  args: {
    label: 'Precio',
    type: 'number',
    icon: 'currency',
    placeholder: '0.00',
    min: 0,
    step: 0.01
  }
};

export const Invalid: Story = {
  args: {
    invalid: true
  }
};

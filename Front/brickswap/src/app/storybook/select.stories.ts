import type { Meta, StoryObj } from '@storybook/angular';

import { UiSelectComponent } from '../shared/ui/select/ui-select.component';

const meta: Meta<UiSelectComponent> = {
  title: 'Shared/UI/Select',
  component: UiSelectComponent,
  argTypes: {
    label: {
      control: 'text'
    },
    placeholder: {
      control: 'text'
    },
    required: {
      control: 'boolean'
    },
    invalid: {
      control: 'boolean'
    },
    errorMessage: {
      control: 'text'
    }
  },
  args: {
    label: 'Categoria',
    placeholder: 'Selecciona una opcion',
    options: [
      { label: 'Star Wars', value: '1' },
      { label: 'Technic', value: '2' },
      { label: 'City', value: '3' }
    ],
    required: false,
    invalid: false,
    errorMessage: ''
  }
};

export default meta;

type Story = StoryObj<UiSelectComponent>;

export const Default: Story = {};

export const Required: Story = {
  args: {
    required: true
  }
};

export const Invalid: Story = {
  args: {
    required: true,
    invalid: true,
    errorMessage: 'Selecciona una opcion valida.'
  }
};

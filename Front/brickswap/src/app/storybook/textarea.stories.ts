import type { Meta, StoryObj } from '@storybook/angular';

import { UiTextareaComponent } from '../shared/ui/textarea/ui-textarea.component';

const meta: Meta<UiTextareaComponent> = {
  title: 'Shared/UI/Textarea',
  component: UiTextareaComponent,
  parameters: {
    canvasWidth: '420px'
  },
  args: {
    label: 'Descripción',
    placeholder: 'Describe el artículo...',
    rows: 4,
    required: true,
    invalid: false,
    errorMessage: 'Este campo es obligatorio',
    value: ''
  }
};

export default meta;

type Story = StoryObj<UiTextareaComponent>;

export const Default: Story = {};

export const Invalid: Story = {
  args: {
    invalid: true
  }
};

import type { Meta, StoryObj } from '@storybook/angular';

import { FormTemplate } from '../shared/components/form-template/form-template';

const meta: Meta<FormTemplate> = {
  title: 'Shared/Components/Form Template',
  component: FormTemplate,
  parameters: {
    canvasWidth: '720px'
  },
  args: {
    title: 'Publicar artículo',
    subtitle: 'Completa la información del set LEGO'
  }
};

export default meta;

type Story = StoryObj<FormTemplate>;

export const Default: Story = {};

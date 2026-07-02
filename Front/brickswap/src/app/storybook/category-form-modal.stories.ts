import type { Meta, StoryObj } from '@storybook/angular';

import { UiCategoryFormModalComponent } from '../shared/components/category-form-modal/category-form-modal.component';

const meta: Meta<UiCategoryFormModalComponent> = {
  title: 'Shared/Components/Category Form Modal',
  component: UiCategoryFormModalComponent,
  parameters: {
    canvasWidth: '560px'
  },
  argTypes: {
    canceled: { action: 'canceled' },
    saved: { action: 'saved' }
  },
  args: {
    title: 'Editar categoría',
    name: 'Star Wars',
    description: 'Sets y naves de la saga',
    icon: '🚀'
  }
};

export default meta;

type Story = StoryObj<UiCategoryFormModalComponent>;

export const Default: Story = {};

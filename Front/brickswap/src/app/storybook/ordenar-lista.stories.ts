import type { Meta, StoryObj } from '@storybook/angular';

import { OrdenarListaComponent } from '../shared/ui/ordenar-lista/ordenar-lista.component';

const meta: Meta<OrdenarListaComponent> = {
  title: 'Shared/UI/Ordenar Lista',
  component: OrdenarListaComponent,
  argTypes: {
    active: { control: 'select', options: ['newest', 'oldest'] },
    changed: { action: 'changed' }
  },
  args: {
    active: 'newest'
  }
};

export default meta;

type Story = StoryObj<OrdenarListaComponent>;

export const Newest: Story = {};

export const Oldest: Story = {
  args: {
    active: 'oldest'
  }
};

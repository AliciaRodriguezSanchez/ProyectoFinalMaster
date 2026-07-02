import type { Meta, StoryObj } from '@storybook/angular';

import { TableComponent } from '../shared/components/table/table.component';

const meta: Meta<TableComponent> = {
  title: 'Shared/Components/Legacy Table',
  component: TableComponent,
  parameters: {
    canvasWidth: '1120px'
  },
  argTypes: {
    typeTable: { control: 'select', options: ['usuarios', 'Pendiente'] },
    ordenarEvent: { action: 'ordenarEvent' }
  },
  args: {
    typeTable: 'usuarios',
    data: [
      {
        id: 1,
        name: 'Alicia Rodríguez',
        email: 'alicia@email.com',
        role: 'Administrador',
        roleId: 3,
        isActive: true
      }
    ]
  }
};

export default meta;

type Story = StoryObj<TableComponent>;

export const Users: Story = {};

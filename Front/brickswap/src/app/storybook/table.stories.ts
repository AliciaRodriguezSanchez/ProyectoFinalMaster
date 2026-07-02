import type { Meta, StoryObj } from '@storybook/angular';

import { TableComponent } from '../shared/table/table.component';
import { brickImage } from './storybook.data';

const meta: Meta<TableComponent> = {
  title: 'Shared/Components/Table',
  component: TableComponent,
  parameters: {
    canvasWidth: '1120px'
  },
  argTypes: {
    typeTable: { control: 'select', options: ['usuarios', 'promotions', 'Pendiente'] },
    ordenarEvent: { action: 'ordenarEvent' },
    actionClick: { action: 'actionClick' },
    roleChange: { action: 'roleChange' },
    promotionChange: { action: 'promotionChange' },
    onGuardarResolucion: { action: 'onGuardarResolucion' }
  },
  args: {
    typeTable: 'promotions',
    sortLabel: 'Más reciente',
    data: [
      {
        id: 10420,
        titulo: 'LEGO Star Wars X-Wing',
        descripcion: 'Set completo',
        foto: brickImage,
        precio: 149.99,
        estado_articulo: 'Como nuevo',
        estado_revision: 'Publicado',
        estado_venta: 'Disponible',
        perfil_id: 1,
        categoria_id: 1,
        in_promotion: 1
      },
      {
        id: 42083,
        titulo: 'LEGO Technic Bugatti Chiron',
        descripcion: 'Caja original',
        foto: brickImage,
        precio: 349.99,
        estado_articulo: 'Nuevo',
        estado_revision: 'Publicado',
        estado_venta: 'Disponible',
        perfil_id: 2,
        categoria_id: 2,
        in_promotion: 0
      }
    ]
  }
};

export default meta;

type Story = StoryObj<TableComponent>;

export const Promotions: Story = {};

export const Users: Story = {
  args: {
    typeTable: 'usuarios',
    data: [
      {
        id: 1,
        name: 'Alicia Rodríguez',
        email: 'alicia@email.com',
        role: 'administrador',
        roleId: 3,
        isActive: true
      },
      {
        id: 2,
        name: 'Moderador User',
        email: 'moderador@email.com',
        role: 'moderador',
        roleId: 2,
        isActive: false
      }
    ]
  }
};

export const PendingReports: Story = {
  args: {
    typeTable: 'Pendiente',
    data: [
      {
        id: 12,
        title: 'LEGO Star Wars X-Wing',
        customer: 'Alicia',
        reason: 'Es falso',
        time: new Date().toISOString(),
        status: 'Pendiente',
        article_id: 10420
      }
    ]
  }
};

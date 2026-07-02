import type { Meta, StoryObj } from '@storybook/angular';

import { CajaMensajeComponent } from '../shared/components/caja-mensaje/caja-mensaje.component';

const meta: Meta<CajaMensajeComponent> = {
  title: 'Shared/Components/Caja Mensaje',
  component: CajaMensajeComponent,
  parameters: {
    canvasWidth: '640px'
  },
  argTypes: {
    status: { control: 'select', options: ['unreaded', 'readed', 'pending', 'resolved'] },
    statusChanged: { action: 'statusChanged' }
  },
  args: {
    name: 'Alicia Rodríguez',
    product: 'LEGO Star Wars X-Wing',
    timeAgo: 'Hace 2 horas',
    status: 'unreaded',
    lastMsg: 'Hola, me interesa el producto. ¿Sigue disponible?',
    showStatusSelect: true
  }
};

export default meta;

type Story = StoryObj<CajaMensajeComponent>;

export const Default: Story = {};

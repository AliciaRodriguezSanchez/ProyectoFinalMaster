import type { Meta, StoryObj } from '@storybook/angular';

import { ReportViewComponent } from '../shared/components/report-view/report-view.component';

const meta: Meta<ReportViewComponent> = {
  title: 'Shared/Components/Report View',
  component: ReportViewComponent,
  parameters: {
    canvasWidth: '560px'
  },
  argTypes: {
    estado: { control: 'select', options: ['Pendiente', 'Revisado_Mantenido'] },
    onClose: { action: 'onClose' },
    onResolve: { action: 'onResolve' }
  },
  args: {
    estado: 'Pendiente',
    reporte: {
      id: 8,
      title: 'LEGO Serie 25 Minifiguras',
      reason: 'Es falso',
      customer: 'Alicia',
      time: new Date().toISOString(),
      resolution: 'Artículo revisado'
    }
  }
};

export default meta;

type Story = StoryObj<ReportViewComponent>;

export const Pending: Story = {};

export const Resolved: Story = {
  args: {
    estado: 'Revisado_Mantenido'
  }
};

import type { Meta, StoryObj } from '@storybook/angular';

import { AdminPanelCardComponent } from '../shared/components/admin-panel-card/admin-panel-card.component';

const meta: Meta<AdminPanelCardComponent> = {
  title: 'Shared/Components/Admin Panel Card',
  component: AdminPanelCardComponent,
  parameters: {
    canvasWidth: '420px'
  },
  argTypes: {
    cardSelected: { action: 'cardSelected' }
  },
  args: {
    card: {
      id: 'promotions',
      icon: 'bi bi-star',
      title: 'Artículos en promoción',
      description: 'Marcar o quitar artículos en promoción',
      colorClass: 'bg-success-subtle text-success'
    },
    isActive: false
  }
};

export default meta;

type Story = StoryObj<AdminPanelCardComponent>;

export const Default: Story = {};

export const Active: Story = {
  args: {
    isActive: true
  }
};

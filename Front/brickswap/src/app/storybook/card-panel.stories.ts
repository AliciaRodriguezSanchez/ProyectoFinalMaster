import type { Meta, StoryObj } from '@storybook/angular';

import { CardPanelComponent } from '../shared/card-panel/card-panel.component';

const meta: Meta<CardPanelComponent> = {
  title: 'Shared/Components/Card Panel',
  component: CardPanelComponent,
  parameters: {
    canvasWidth: '320px'
  },
  args: {
    stat: {
      label: 'Usuarios totales',
      nombreMostrar: 'Usuarios totales',
      stadistics: 126,
      icon: 'bi-people-fill',
      color: 'text-primary',
      bgClass: 'bg-primary-subtle'
    },
    isActive: false
  }
};

export default meta;

type Story = StoryObj<CardPanelComponent>;

export const Default: Story = {};

export const Active: Story = {
  args: {
    isActive: true
  }
};

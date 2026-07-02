import type { Meta, StoryObj } from '@storybook/angular';

import { UiInfoCardComponent } from '../shared/components/info-card/info-card.component';

const meta: Meta<UiInfoCardComponent> = {
  title: 'Shared/Components/Info Card',
  component: UiInfoCardComponent,
  parameters: {
    canvasWidth: '280px'
  },
  args: {
    icon: '🛡️',
    title: 'Envíos seguros',
    description: 'Compra y vende con protección durante todo el proceso.'
  }
};

export default meta;

type Story = StoryObj<UiInfoCardComponent>;

export const Default: Story = {};

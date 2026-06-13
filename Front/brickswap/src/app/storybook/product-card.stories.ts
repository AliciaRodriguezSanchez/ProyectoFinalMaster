import type { Meta, StoryObj } from '@storybook/angular';

import { UiProductCardComponent } from '../shared/components/product-card/product-card.component';
import { brickImage } from './storybook.data';

const meta: Meta<UiProductCardComponent> = {
  title: 'Shared/Components/Product Card',
  component: UiProductCardComponent,
  args: {
    imageUrl: brickImage,
    title: 'Set LEGO City completo',
    price: 34.99,
    location: 'Madrid',
    publishedAt: 'Hoy',
    showBadge: true,
    badgeText: 'Nuevo'
  },
  argTypes: {
    price: {
      control: {
        type: 'number',
        min: 0,
        step: 1
      }
    }
  }
};

export default meta;

type Story = StoryObj<UiProductCardComponent>;

export const WithBadge: Story = {};

export const WithoutBadge: Story = {
  args: {
    title: 'Lote de piezas variadas',
    price: 18.5,
    location: 'Valencia',
    publishedAt: 'Ayer',
    showBadge: false
  }
};

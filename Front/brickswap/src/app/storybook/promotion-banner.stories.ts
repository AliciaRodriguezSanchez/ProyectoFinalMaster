import type { Meta, StoryObj } from '@storybook/angular';

import { PromotionBannerComponent } from '../shared/components/promotion-banner/promotion-banner.component';
import { bannerImage } from './storybook.data';

const meta: Meta<PromotionBannerComponent> = {
  title: 'Shared/Components/Promotion Banner',
  component: PromotionBannerComponent,
  parameters: {
    canvasWidth: '980px'
  },
  args: {
    title: 'Compra, vende e intercambia LEGO',
    description: 'Encuentra sets completos, piezas sueltas y minifiguras de otros fans de BrickSwap.',
    imageUrl: bannerImage
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 980px;">
        <app-hero-banner
          [title]="title"
          [description]="description"
          [imageUrl]="imageUrl"
        />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<PromotionBannerComponent>;

export const Default: Story = {};

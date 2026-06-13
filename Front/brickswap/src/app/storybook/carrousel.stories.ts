import type { Meta, StoryObj } from '@storybook/angular';

import { UiCarrouselComponent } from '../shared/components/carrousel/carrousel.component';
import { categoryItems } from './storybook.data';

const meta: Meta<UiCarrouselComponent> = {
  title: 'Shared/Components/Carrousel',
  component: UiCarrouselComponent,
  args: {
    items: categoryItems
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 760px;">
        <ui-carrousel [items]="items" />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<UiCarrouselComponent>;

export const Default: Story = {};

export const ShortList: Story = {
  args: {
    items: categoryItems.slice(0, 3)
  }
};

import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { UiCarrouselComponent } from '../shared/components/carrousel/carrousel.component';
import { UiCategoryCardComponent } from '../shared/components/category-card/category-card.component';
import { categoryItems } from './storybook.data';

const meta: Meta<UiCarrouselComponent> = {
  title: 'Shared/Components/Carrousel',
  component: UiCarrouselComponent,
  decorators: [
    moduleMetadata({
      imports: [UiCategoryCardComponent],
    }),
  ],
  args: {
    items: categoryItems
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 760px;">
        <ui-carrousel>
          @for (item of items; track item.text) {
            <ui-category-card
              [icon]="item.icon"
              [color]="item.color"
              [text]="item.text"
            />
          }
        </ui-carrousel>
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

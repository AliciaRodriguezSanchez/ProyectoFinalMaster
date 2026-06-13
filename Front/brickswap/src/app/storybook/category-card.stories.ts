import type { Meta, StoryObj } from '@storybook/angular';

import { UiCategoryCardComponent } from '../shared/components/category-card/category-card.component';

const meta: Meta<UiCategoryCardComponent> = {
  title: 'Shared/Components/Category Card',
  component: UiCategoryCardComponent,
  args: {
    icon: 'CITY',
    color: '#0284c7',
    text: 'City'
  },
  argTypes: {
    color: {
      control: 'color'
    }
  }
};

export default meta;

type Story = StoryObj<UiCategoryCardComponent>;

export const Default: Story = {};

export const StarWars: Story = {
  args: {
    icon: 'STAR',
    color: '#7c3aed',
    text: 'Star Wars'
  }
};

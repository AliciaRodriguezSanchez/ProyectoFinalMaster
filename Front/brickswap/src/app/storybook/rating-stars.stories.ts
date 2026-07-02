import type { Meta, StoryObj } from '@storybook/angular';

import { UiRatingStarsComponent } from '../shared/components/rating-stars/rating-stars.component';

const meta: Meta<UiRatingStarsComponent> = {
  title: 'Shared/Components/Rating Stars',
  component: UiRatingStarsComponent,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] }
  },
  args: {
    rating: 4.8,
    reviewCount: 12,
    showValue: true,
    showReviewCount: true,
    size: 'md'
  }
};

export default meta;

type Story = StoryObj<UiRatingStarsComponent>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: 'sm'
  }
};

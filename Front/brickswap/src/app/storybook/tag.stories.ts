import type { Meta, StoryObj } from '@storybook/angular';

import { TagComponent } from '../shared/tag/tag.component';

const meta: Meta<TagComponent> = {
  title: 'Shared/UI/Tag',
  component: TagComponent,
  argTypes: {
    label: {
      control: 'text'
    },
    icon: {
      control: 'text'
    },
    variant: {
      control: 'select',
      options: ['neutral', 'brand', 'dark']
    }
  },
  args: {
    label: 'Publicado',
    icon: '',
    variant: 'neutral'
  }
};

export default meta;

type Story = StoryObj<TagComponent>;

export const Neutral: Story = {};

export const Brand: Story = {
  args: {
    label: 'Reservado',
    variant: 'brand'
  }
};

export const Dark: Story = {
  args: {
    label: 'Vendido',
    variant: 'dark'
  }
};

export const WithIcon: Story = {
  args: {
    label: 'Harry Potter',
    icon: '🏷️'
  }
};

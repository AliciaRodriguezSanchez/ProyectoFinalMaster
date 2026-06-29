import type { Meta, StoryObj } from '@storybook/angular';

import { UiFavoriteButtonComponent } from '../shared/ui/favorite-button/ui-favorite-button.component';

const meta: Meta<UiFavoriteButtonComponent> = {
  title: 'Shared/UI/Favorite Button',
  component: UiFavoriteButtonComponent,
  argTypes: {
    label: {
      control: 'text'
    },
    disabled: {
      control: 'boolean'
    },
    selected: {
      control: 'boolean'
    },
    clicked: {
      action: 'clicked'
    }
  },
  args: {
    label: 'Añadir a favoritos',
    disabled: false,
    selected: false
  }
};

export default meta;

type Story = StoryObj<UiFavoriteButtonComponent>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const Selected: Story = {
  args: {
    selected: true
  }
};

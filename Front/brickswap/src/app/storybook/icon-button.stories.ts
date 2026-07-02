import type { Meta, StoryObj } from '@storybook/angular';

import { UiIconButtonComponent } from '../shared/ui/icon-button/ui-icon-button.component';

const meta: Meta<UiIconButtonComponent> = {
  title: 'Shared/UI/Icon Button',
  component: UiIconButtonComponent,
  parameters: {
    canvasWidth: '280px'
  },
  argTypes: {
    label: {
      control: 'text'
    },
    icon: {
      control: 'select',
      options: ['message', 'flag', 'reserve']
    },
    variant: {
      control: 'select',
      options: ['neutral', 'danger']
    },
    disabled: {
      control: 'boolean'
    },
    iconOnly: {
      control: 'boolean'
    },
    clicked: {
      action: 'clicked'
    }
  },
  args: {
    label: 'Chatear',
    icon: 'message',
    variant: 'neutral',
    disabled: false,
    iconOnly: false
  }
};

export default meta;

type Story = StoryObj<UiIconButtonComponent>;

export const Message: Story = {};

export const Danger: Story = {
  args: {
    label: 'Reportar',
    icon: 'flag',
    variant: 'danger'
  }
};

export const IconOnly: Story = {
  args: {
    label: 'Reservar',
    icon: 'reserve',
    iconOnly: true
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

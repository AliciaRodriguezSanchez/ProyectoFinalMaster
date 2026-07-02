import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideRouter } from '@angular/router';

import { Header } from '../shared/components/header/header';

const meta: Meta<Header> = {
  title: 'Shared/Components/Header',
  component: Header,
  parameters: {
    canvasWidth: '1180px'
  },
  decorators: [applicationConfig({ providers: [provideRouter([])] })]
};

export default meta;

type Story = StoryObj<Header>;

export const Default: Story = {};

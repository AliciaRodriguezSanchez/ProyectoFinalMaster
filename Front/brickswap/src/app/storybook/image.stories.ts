import type { Meta, StoryObj } from '@storybook/angular';

import { UiImageComponent } from '../shared/ui/image/ui-image.component';
import { brickImage } from './storybook.data';

const meta: Meta<UiImageComponent> = {
  title: 'Shared/UI/Image',
  component: UiImageComponent,
  argTypes: {
    src: {
      control: 'text'
    },
    alt: {
      control: 'text'
    },
    fallbackSrc: {
      control: 'text'
    },
    fit: {
      control: 'select',
      options: ['cover', 'contain', 'fill', 'scale-down']
    }
  },
  args: {
    src: brickImage,
    alt: 'Set de piezas LEGO',
    fallbackSrc: brickImage,
    fit: 'contain'
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 320px; height: 320px; border: 1px solid var(--brick-color-border); border-radius: var(--brick-radius-2xl); overflow: hidden; background: var(--brick-color-surface-muted);">
        <ui-image
          [src]="src"
          [alt]="alt"
          [fallbackSrc]="fallbackSrc"
          [fit]="fit"
        />
      </div>
    `
  })
};

export default meta;

type Story = StoryObj<UiImageComponent>;

export const Contain: Story = {};

export const Cover: Story = {
  args: {
    fit: 'cover'
  }
};

export const WithFallback: Story = {
  args: {
    src: 'missing-image.jpg'
  }
};

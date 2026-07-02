import type { Meta, StoryObj } from '@storybook/angular';

import { AvatarUploader } from '../shared/components/avatar-uploader/avatar-uploader';
import { brickImage } from './storybook.data';

const meta: Meta<AvatarUploader> = {
  title: 'Shared/Components/Avatar Uploader',
  component: AvatarUploader,
  parameters: {
    canvasWidth: '220px'
  },
  argTypes: {
    onFileSelected: { action: 'onFileSelected' }
  },
  args: {
    currentImageUrl: brickImage
  }
};

export default meta;

type Story = StoryObj<AvatarUploader>;

export const Default: Story = {};

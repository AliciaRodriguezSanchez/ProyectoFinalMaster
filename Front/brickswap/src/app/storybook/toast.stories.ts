import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { UiToastService } from '../core/services/toast/ui-toast.service';
import { UiToastComponent } from '../shared/ui/toast/ui-toast.component';

const toastServiceMock = {
  messages: () => [
    { id: 1, type: 'success', message: 'El cambio se realizó correctamente' },
    { id: 2, type: 'warning', message: 'Necesitas haber iniciado sesión antes de querer hacer esta acción' }
  ],
  remove: () => undefined
} as unknown as UiToastService;

const meta: Meta<UiToastComponent> = {
  title: 'Shared/UI/Toast',
  component: UiToastComponent,
  parameters: {
    canvasWidth: '420px'
  },
  decorators: [
    moduleMetadata({
      providers: [{ provide: UiToastService, useValue: toastServiceMock }]
    })
  ]
};

export default meta;

type Story = StoryObj<UiToastComponent>;

export const Default: Story = {};

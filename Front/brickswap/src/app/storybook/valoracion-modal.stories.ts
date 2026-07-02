import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { of } from 'rxjs';

import { AuthService } from '../core/services/auth/auth.service';
import { ReviewService } from '../core/services/review/review.service';
import { UiToastService } from '../core/services/toast/ui-toast.service';
import { ValoracionModalComponent } from '../shared/components/valoracion-modal/valoracion-modal';

const meta: Meta<ValoracionModalComponent> = {
  title: 'Shared/Components/Valoracion Modal',
  component: ValoracionModalComponent,
  parameters: {
    canvasWidth: '520px'
  },
  decorators: [
    applicationConfig({
      providers: [
        {
          provide: AuthService,
          useValue: {
            getCurrentUserId: () => 26
          }
        },
        {
          provide: ReviewService,
          useValue: {
            createReview: () => of({ message: 'Valoración enviada correctamente' })
          }
        },
        {
          provide: UiToastService,
          useValue: {
            success: () => undefined,
            error: () => undefined,
            warning: () => undefined
          }
        }
      ]
    })
  ],
  args: {
    articleId: 10420,
    vendedorId: 12
  }
};

export default meta;

type Story = StoryObj<ValoracionModalComponent>;

export const Default: Story = {};

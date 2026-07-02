import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideRouter } from '@angular/router';

import { ArticleCard } from '../shared/components/article-card/article-card';
import { brickImage } from './storybook.data';

const meta: Meta<ArticleCard> = {
  title: 'Shared/Components/Article Card',
  component: ArticleCard,
  parameters: {
    canvasWidth: '320px'
  },
  decorators: [applicationConfig({ providers: [provideRouter([])] })],
  args: {
    article: {
      id: 10420,
      titulo: 'LEGO Star Wars X-Wing',
      descripcion: 'Set completo',
      foto: brickImage,
      precio: 149.99,
      estado_articulo: 'Como nuevo',
      estado_revision: 'Publicado',
      estado_venta: 'Disponible',
      perfil_id: 1,
      categoria_id: 1
    }
  }
};

export default meta;

type Story = StoryObj<ArticleCard>;

export const Default: Story = {};

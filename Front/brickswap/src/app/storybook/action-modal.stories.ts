import type { Meta, StoryObj } from '@storybook/angular';

import { ActionModalComponent } from '../shared/components/action-modal/action-modal.component';

const meta: Meta<ActionModalComponent> = {
  title: 'Shared/Components/Action Modal',
  component: ActionModalComponent,
  parameters: {
    canvasWidth: '520px'
  },
  argTypes: {
    title: {
      control: 'text'
    },
    textareaLabel: {
      control: 'text'
    },
    textareaPlaceholder: {
      control: 'text'
    },
    fieldType: {
      control: 'select',
      options: ['textarea', 'input']
    },
    inputType: {
      control: 'select',
      options: ['email', 'password', 'text', 'number']
    },
    inputIcon: {
      control: 'select',
      options: ['email', 'lock', 'profile', 'currency']
    },
    submitLabel: {
      control: 'text'
    },
    cancelLabel: {
      control: 'text'
    },
    requiredError: {
      control: 'text'
    },
    canceled: {
      action: 'canceled'
    },
    submitted: {
      action: 'submitted'
    }
  },
  args: {
    title: 'Chatear con el vendedor',
    textareaLabel: 'Mensaje',
    textareaPlaceholder: 'Escribe tu mensaje para el vendedor',
    fieldType: 'textarea',
    inputType: 'text',
    inputIcon: 'email',
    submitLabel: 'Enviar mensaje',
    cancelLabel: 'Cancelar',
    requiredError: 'Este campo es obligatorio'
  }
};

export default meta;

type Story = StoryObj<ActionModalComponent>;

export const Chat: Story = {};

export const Report: Story = {
  args: {
    title: 'Denunciar artículo',
    textareaLabel: 'Motivo de la denuncia',
    textareaPlaceholder: 'Explica el motivo de la denuncia',
    submitLabel: 'Enviar denuncia'
  }
};

export const Price: Story = {
  args: {
    title: 'Proponer precio',
    textareaLabel: 'Precio',
    textareaPlaceholder: 'Introduce la propuesta de precio',
    fieldType: 'input',
    inputType: 'number',
    inputIcon: 'currency',
    inputMin: 0,
    inputStep: '0.01',
    submitLabel: 'Enviar precio'
  }
};

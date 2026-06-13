import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Brickswap/Welcome',
  render: () => ({
    template: `
      <main style="font-family: system-ui, sans-serif; padding: 2rem;">
        <h1 style="margin: 0 0 0.5rem;">Brickswap</h1>
        <p style="margin: 0; color: #475569;">Stories listas en src/app/storybook.</p>
      </main>
    `
  })
};

export default meta;

type Story = StoryObj;

export const Ready: Story = {};

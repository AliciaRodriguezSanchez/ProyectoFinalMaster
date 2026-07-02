import type { Preview } from '@storybook/angular';

const preview: Preview = {
  decorators: [
    (story, context) => {
      const renderedStory = story();
      const canvasWidth = context.parameters['canvasWidth'] || '720px';

      if (!renderedStory.template) {
        return renderedStory;
      }

      return {
        ...renderedStory,
        template: `
          <div style="width: ${canvasWidth}; max-width: calc(100vw - 48px);">
            ${renderedStory.template}
          </div>
        `,
      };
    },
  ],
  parameters: {
    canvasWidth: '720px',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;

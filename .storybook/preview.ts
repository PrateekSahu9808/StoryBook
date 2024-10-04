import type { Preview } from '@storybook/react';

import '../index.scss';

const preview: Preview = {
  parameters: {
    actions: {  },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      source: {
        language: 'tsx',
      },
    },
  },

  tags: ['autodocs']
};

export default preview;

import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
  e2e: {
    supportFile: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        log(message: unknown) {
          console.log(message);
          return null;
        },
      });
      return config;
    },
  },
});

import { mergeConfig, defineConfig } from 'vite';
import vitestConfig from './vitest.config';

export default mergeConfig(
  vitestConfig,
  defineConfig({
    test: {
      include: ['**/*.spec.ts']
    }
  })
);

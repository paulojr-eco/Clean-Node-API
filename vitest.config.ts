import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'istanbul',
      reporter: ['lcov'],
      exclude: ['**/main/**', '**/test/**']
    }
  },
  plugins: [tsconfigPaths()]
});

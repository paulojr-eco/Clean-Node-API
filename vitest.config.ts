import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'istanbul',
      exclude: ['**/main/**']
    }
  },
  plugins: [tsconfigPaths()]
});

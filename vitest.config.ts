import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'istanbul'
    },
    setupFiles: ['./setup/mongo-memory-server.ts']
  },
  plugins: [tsconfigPaths()]
});

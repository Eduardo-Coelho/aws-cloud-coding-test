import { defineConfig } from 'vitest/config';
import type { UserConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig(
  (): UserConfig => ({
    resolve: {
      alias: {
        '@': resolve(__dirname, './src/'),
      },
    },
    test: {
      globals: true,
      watch: false,
      include: ['test/**/*.test.ts', 'test/**/*.test.js'],
      clearMocks: true,
      setupFiles: [],
      coverage: {
        all: true,
        provider: 'istanbul',
        enabled: true,
        branches: 100,
        lines: 100,
        functions: 100,
        statements: 100,
        include: ['src/**/**', 'cdk/**/**'],
        exclude: ['src/index.ts', 'src/index.js', '**/__mocks__/**'],
        extension: ['.js', '.ts'],
        reporter: ['text'],
      },
    },
  })
);

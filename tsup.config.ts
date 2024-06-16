import { defineConfig } from 'tsup';

export default defineConfig(() => ({
  format: ['cjs'],
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [/@aws-sdk\/.*$/],
  entry: ['./src/index.ts'],
}));

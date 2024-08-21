import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sassDts from 'vite-plugin-sass-dts';
import { extname, relative, resolve } from 'path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sassDts(), libInjectCss(), dts({ include: ['lib'] })],
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: '@use "@theme/commons.scss" as *;',
      },
    },
  },
  build: {
    lib: {
      name: 'common-library',
      entry: resolve(__dirname, 'lib/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      // do not bundle react. external tools should have react already.
      external: ['react', 'react/jsx-runtime'],
      // split up css instead of 1 huge css
      input: Object.fromEntries(
        glob
          .sync('lib/**/*.{ts,tsx}', {
            ignore: ['lib/**/*.d.ts', 'lib/**/*.stories.tsx'],
          })
          .map(file => [
            // The name of the entry point
            // lib/nested/foo.ts becomes nested/foo
            relative('lib', file.slice(0, file.length - extname(file).length)),
            // The absolute path to the entry file
            // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
      // clean up output structure
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      },
    },
  },
  resolve: {
    alias: {
      '@components': resolve(__dirname, './lib/components'),
      '@pages': resolve(__dirname, './lib/pages'),
      '@markdown': resolve(__dirname, './lib/markdown'),
      '@theme': resolve(__dirname, './lib/theme'),
    },
  },
});

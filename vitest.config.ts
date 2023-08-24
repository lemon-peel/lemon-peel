import { defineConfig } from 'vitest/config';
import VueMacros from 'unplugin-vue-macros/vite';
import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  plugins: [
    VueMacros({
      setupComponent: false,
      setupSFC: false,
      plugins: {
        vue: Vue(),
        vueJsx: VueJsx(),
      },
    }) as any,
  ],
  optimizeDeps: {
    disabled: true,
  },
  test: {
    include: [
      '**/*.test.[jt]s?(x)',
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',

      '**/selectV2/**',
      '**/tableV2/**',
      '**/treeV2/**',
    ],
    clearMocks: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    transformMode: {
      web: [/\.[jt]sx$/],
    },
  },
});

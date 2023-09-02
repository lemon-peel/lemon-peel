import path from 'node:path';
import Inspect from 'vite-plugin-inspect';
import { defineConfig, loadEnv } from 'vite';
import VueMacros from 'unplugin-vue-macros/vite';
import UnoCSS from 'unocss/vite';
import mkcert from 'vite-plugin-mkcert';
import glob from 'fast-glob';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Components from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';

import { docPkg, mainPkg, getPackageDependencies, projDir } from '@lemon-peel/build-utils';

import { MarkdownTransform } from './.vitepress/plugins/markdownTransform';

import type { Alias } from 'vite';

const alias: Alias[] = [
  { find: '@/', replacement: `${path.resolve(__dirname, './.vitepress')}/` },
];

if (process.env.DOC_ENV !== 'production') {
  alias.push(
    { find: /^lemon-peel(\/(es|lib))?$/, replacement: path.resolve(projDir, 'packages/main/index.ts') },
    { find: /^lemon-peel\/(es|lib)\/(.*)$/, replacement: `${path.resolve(projDir, 'packages')}/$2` },
  );
}

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const { dependencies: epDeps } = getPackageDependencies(mainPkg);
  const { dependencies: docsDeps } = getPackageDependencies(docPkg);

  const optimizeDeps = [...new Set([...epDeps, ...docsDeps])].filter(
    dep =>
      !dep.startsWith('@types/') &&
      !['@lemon-peel/metadata', 'lemon-peel'].includes(dep),
  );

  optimizeDeps.push(
    ...(await glob(['dayjs/plugin/*.js'], {
      cwd: path.resolve(projDir, 'node_modules'),
      onlyFiles: true,
    })),
  );

  return {
    server: {
      host: true,
      https: !!env.HTTPS,
      fs: {
        allow: [projDir],
      },
    },
    resolve: {
      alias,
    },
    plugins: [
      VueMacros({
        setupComponent: false,
        setupSFC: false,
        plugins: {
          vueJsx: vueJsx(),
        },
      }),

      // https://github.com/antfu/unplugin-vue-components
      Components({
        dirs: ['.vitepress/vitepress/components'],

        allowOverrides: true,

        // custom resolvers
        resolvers: [
          // auto import icons
          // https://github.com/antfu/unplugin-icons
          IconsResolver(),
        ],

        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      }),

      // https://github.com/antfu/unplugin-icons
      Icons({ autoInstall: true }),
      UnoCSS(),
      MarkdownTransform(),
      Inspect(),
      mkcert(),
    ],
    optimizeDeps: {
      include: optimizeDeps,
      exclude: ['path', 'fs'],
    },
  };
});

import { rollup } from 'rollup';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueMacros from 'unplugin-vue-macros/rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import glob from 'fast-glob';
import { projDir, withDefaultExclude, pkgDir } from '@lemon-peel/build-utils';
import { generateExternal, writeBundles } from '../utils';
import { LemonPeelAlias } from '../plugins/lemonPeelAlias';
import { buildConfigEntries, target } from '../buildInfo';

import type { OutputOptions } from 'rollup';

export const buildModules = async () => {
  const input = withDefaultExclude(
    await glob('**/*.{js,ts,vue}', {
      cwd: pkgDir,
      absolute: true,
      onlyFiles: true,
    }),
  );

  const bundle = await rollup({
    input,
    plugins: [
      LemonPeelAlias(),
      VueMacros({
        setupComponent: false,
        setupSFC: false,
        plugins: {
          vue: vue({
            // isProduction: false,
          }),
          vueJsx: vueJsx(),
        },
      }),
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts'],
      }),
      commonjs(),
      esbuild({
        sourceMap: false,
        target,
        loaders: {
          '.vue': 'ts',
        },
      }),
    ],
    external: await generateExternal({ full: false }),
    treeshake: false,
  });

  await writeBundles(
    bundle,
    buildConfigEntries.map(([module, config]): OutputOptions => {
      return {
        format: config.format,
        dir: config.output.path,
        exports: module === 'cjs' ? 'named' : undefined,
        preserveModules: true,
        preserveModulesRoot: projDir,
        sourcemap: true,
        entryFileNames: `[name].${config.ext}`,
      };
    }),
  );
};

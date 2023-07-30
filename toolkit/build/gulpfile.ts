import path from 'node:path';
import { copyFile, mkdir } from 'node:fs/promises';
import { copy } from 'fs-extra';
import { parallel, series } from 'gulp';
import { buildOutput, lpOutput, mainPackage, lpRoot } from '@lemon-peel/build-utils';
import { buildConfig, run, runTask, withTaskName } from './src';
import type { TaskFunction } from 'gulp';
import type { Module } from './src';

import 'undertaker';

export const copyFiles = () =>
  Promise.all([
    copyFile(mainPackage, path.join(lpOutput, 'package.json')),
    copyFile(
      path.resolve(lpRoot, 'README.md'),
      path.resolve(lpOutput, 'README.md'),
    ),
    copyFile(
      path.resolve(lpRoot, 'global.d.ts'),
      path.resolve(lpOutput, 'global.d.ts'),
    ),
  ]);

export const copyTypesDefinitions: TaskFunction = done => {
  const src = path.resolve(buildOutput, 'types', 'packages');
  const copyTypes = (module: Module) =>
    withTaskName(`copyTypes:${module}`, () =>
      copy(src, buildConfig[module].output.path),
    );

  return parallel(copyTypes('esm'), copyTypes('cjs'))(done);
};

export const copyFullStyle = async () => {
  await mkdir(path.resolve(lpOutput, 'dist'), { recursive: true });
  await copyFile(
    path.resolve(lpOutput, 'theme-chalk/index.css'),
    path.resolve(lpOutput, 'dist/index.css'),
  );
};

export default series(
  withTaskName('clean', () => run('pnpm run clean')),
  withTaskName('createOutput', () => mkdir(lpOutput, { recursive: true })),

  parallel(
    runTask('buildModules'),
    // runTask('buildFullBundle'),
    // runTask('generateTypesDefinitions'),
    // runTask('buildHelper'),
    // series(
    //   withTaskName('buildThemeChalk', () =>
    //     run('pnpm run -C packages/theme-chalk build'),
    //   ),
    //   copyFullStyle,
    // ),
  ),

  parallel(copyTypesDefinitions, copyFiles),
);

export * from './src';

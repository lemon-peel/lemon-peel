/* eslint-disable @typescript-eslint/consistent-type-imports */
import path from 'node:path';
import { copyFile, mkdir, readFile, readdir, writeFile, stat } from 'node:fs/promises';
import { parallel, series } from 'gulp';
import { buildOutput, lpOutput, mainPkg, projDir } from '@lemon-peel/build-utils';
import { buildConfig, pathRewriter, run, runTask, withTaskName } from './src';
import type { Module } from './src';
import type { TaskFunction } from 'gulp';

import 'undertaker';
export * from './src';

export const copyFiles = () =>
  Promise.all([
    copyFile(mainPkg, path.join(lpOutput, 'package.json')),
    copyFile(
      path.resolve(projDir, 'README.md'),
      path.resolve(lpOutput, 'README.md'),
    ),
    copyFile(
      path.resolve(projDir, 'global.d.ts'),
      path.resolve(lpOutput, 'global.d.ts'),
    ),
  ]);

// Copy src to dest with replace chars of content
export const copyAndRelace = async (
  src: string,
  dest: string,
  replace: (content: string) => string,
) => {
  await mkdir(dest, { recursive: true });
  const files = await readdir(src);
  await Promise.all(
    files.map(async file => {
      const srcFile = path.resolve(src, file);
      const destFile = path.resolve(dest, file);
      const st = await stat(srcFile);
      if (st.isDirectory()) {
        await copyAndRelace(srcFile, destFile, replace);
      } else {
        //copy file with replace chars of content by replace callback
        const content = await readFile(srcFile, 'utf8');
        await writeFile(destFile, replace(content), 'utf8');
      }
    }),
  );
};

export const copyTypesDefinitions: TaskFunction = done => {
  const src = path.resolve(buildOutput, 'types', 'packages');
  const copyTypes = (module: Module) =>
    withTaskName(`copyTypes:${module}`, () =>
      copyAndRelace(src, buildConfig[module].output.path, pathRewriter(module)),
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
    runTask('buildFullBundle'),
    withTaskName('generateTypes', () => run('pnpm run tsc')),
    runTask('buildHelper'),
    series(
      withTaskName('buildThemeChalk', () =>
        run('pnpm run -C packages/theme-chalk build'),
      ),
      copyFullStyle,
    ),
  ),

  parallel(copyTypesDefinitions, copyFiles),
);

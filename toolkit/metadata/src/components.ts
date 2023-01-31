import path from 'node:path';
import glob from 'fast-glob';
import chalk from 'chalk';
import consola from 'consola';
import { ensureDir, lpRoot, writeJson } from '@lemon-peel/build-utils';

const pathOutput = path.resolve(__dirname, '..', 'dist');

async function main() {
  await ensureDir(pathOutput);

  const components = await glob('*', {
    cwd: path.resolve(lpRoot, 'packages/components'),
    onlyDirectories: true,
  });

  await writeJson(path.resolve(pathOutput, 'components.json'), components);
  consola.success(chalk.green('Component list generated'));
}

main();

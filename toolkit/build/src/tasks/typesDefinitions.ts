import path from 'node:path';

import { buildOutput } from '@lemon-peel/build-utils';
import { run } from '../utils/process';

const outDir = path.resolve(buildOutput, 'types');
const command = path.resolve(process.cwd(), 'node_modules/.bin/vue-tsc');

export const generateTypesDefinitions = async () => {
  const basicGlob = '**/*.{js?(x),ts?(x),vue}';

  const allGlob = `packages/${basicGlob}`;
  const noMainGlob = 'packages/main/**/*';
  const mainGlob = `packages/main/${basicGlob}}`;

  await run(`${command} "${allGlob}" --excludeFiles "${noMainGlob}" --outDir ${outDir}`);
  await run(`${command} "${mainGlob}" --outDir ${outDir}`);
};

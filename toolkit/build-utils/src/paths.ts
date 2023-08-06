/* eslint-disable @typescript-eslint/naming-convention */
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const projDir = resolve(__dirname, '..', '..', '..');
export const pkgDir = resolve(projDir, 'packages');
export const compDir = resolve(pkgDir, 'components');
export const themeDir = resolve(pkgDir, 'theme-chalk');
export const hookDir = resolve(pkgDir, 'hooks');
export const localeDir = resolve(pkgDir, 'locale');
export const directiveDir = resolve(pkgDir, 'directives');
export const mainDir = resolve(pkgDir, 'main');
export const utilDir = resolve(pkgDir, 'utils');
export const buildDir = resolve(projDir, 'toolkit', 'build');

// Docs
export const docDir = resolve(projDir, 'docs');
export const vpDir = resolve(docDir, '.vitepress');

/** `/dist` */
export const buildOutput = resolve(projDir, 'dist');
/** `/dist/lemon-peel` */
export const lpOutput = resolve(buildOutput, 'lemon-peel');

export const projPkg = resolve(projDir, 'package.json');
export const compPkg = resolve(compDir, 'package.json');
export const themePkg = resolve(themeDir, 'package.json');
export const hookPkg = resolve(hookDir, 'package.json');
export const localePkg = resolve(localeDir, 'package.json');
export const directivePkg = resolve(directiveDir, 'package.json');
export const mainPkg = resolve(mainDir, 'package.json');
export const utilPkg = resolve(utilDir, 'package.json');
export const docPkg = resolve(docDir, 'package.json');

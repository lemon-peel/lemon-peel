import { resolve } from 'node:path';

export const lpRoot = resolve(__dirname, '..', '..', '..');
export const pkgRoot = resolve(lpRoot, 'packages');
export const compRoot = resolve(pkgRoot, 'components');
export const themeRoot = resolve(pkgRoot, 'theme-chalk');
export const hookRoot = resolve(pkgRoot, 'hooks');
export const localeRoot = resolve(pkgRoot, 'locale');
export const directiveRoot = resolve(pkgRoot, 'directives');
export const mainPkg = resolve(pkgRoot, 'main');
export const utilRoot = resolve(pkgRoot, 'utils');
export const buildRoot = resolve(lpRoot, 'toolkit', 'build');

// Docs
export const docsDirName = 'docs';
export const docRoot = resolve(lpRoot, docsDirName);
export const vpRoot = resolve(docRoot, '.vitepress');

/** `/dist` */
export const buildOutput = resolve(lpRoot, 'dist');
/** `/dist/lemon-peel` */
export const lpOutput = resolve(buildOutput, 'lemon-peel');

export const projPackage = resolve(lpRoot, 'package.json');
export const compPackage = resolve(compRoot, 'package.json');
export const themePackage = resolve(themeRoot, 'package.json');
export const hookPackage = resolve(hookRoot, 'package.json');
export const localePackage = resolve(localeRoot, 'package.json');
export const directivePackage = resolve(directiveRoot, 'package.json');
export const mainPackage = resolve(mainPkg, 'package.json');
export const utilPackage = resolve(utilRoot, 'package.json');
export const docPackage = resolve(docRoot, 'package.json');

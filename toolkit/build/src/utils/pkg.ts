import { PKG_NAME, PKG_PREFIX } from '@lemon-peel/build-constants';
import { buildConfig } from '../buildInfo';

import type { Module } from '../buildInfo';

/** used for type generator */
export const pathRewriter = (module: Module) => {
  const config = buildConfig[module];

  return (id: string) => {
    id = id.replaceAll(`${PKG_PREFIX}/theme-chalk`, `${PKG_NAME}/theme-chalk`);
    id = id.replaceAll(`${PKG_PREFIX}/`, `${config.bundle.path}/`);
    return id;
  };
};

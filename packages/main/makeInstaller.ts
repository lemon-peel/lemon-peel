import { provideGlobalConfig } from '@lemon-peel/hooks/src';
import { INSTALLED_KEY } from '@lemon-peel/constants';
import { version } from './version';

import type { App, Plugin } from 'vue';
import type { ConfigProviderContext } from '@lemon-peel/tokens';

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App, options?: ConfigProviderContext) => {
    if (app[INSTALLED_KEY]) return;

    app[INSTALLED_KEY] = true;
    for (const c of components) app.use(c);

    if (options) provideGlobalConfig(options, app, true);
  };

  return {
    version,
    install,
  };
};

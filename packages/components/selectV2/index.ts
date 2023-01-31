
import type { App, Component, Plugin } from 'vue';
import type { SFCWithInstall } from '@lemon-peel/utils';

import Select from './src/Select.vue';

Select.install = (app: App): void => {
  app.component(Select.name, Select);
};

export const LpSelectV2: Component & Plugin = Select as SFCWithInstall<typeof Select>;

export default LpSelectV2;

export * from './src/token';


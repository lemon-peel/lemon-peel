import TreeSelect from './src/TreeSelect.vue';

import type { App } from 'vue';
import type { SFCWithInstall } from '@lemon-peel/utils';

TreeSelect.install = (app: App): void => {
  app.component(TreeSelect.name, TreeSelect);
};

const withInstaller = TreeSelect as SFCWithInstall<typeof TreeSelect>;

export default withInstaller;
export const LpTreeSelect = withInstaller;

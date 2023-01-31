import Tree from './src/Tree.vue';

import type { App } from 'vue';
import type { SFCWithInstall } from '@lemon-peel/utils';

Tree.install = (app: App): void => {
  app.component(Tree.name, Tree);
};

const withInstaller = Tree as SFCWithInstall<typeof Tree>;

export default withInstaller;
export const LpTree = withInstaller;

import CascaderPanel from './src/Index.vue';
import type { App } from 'vue';
import type { SFCWithInstall } from '@lemon-peel/utils';

const withInstaller = CascaderPanel as SFCWithInstall<typeof CascaderPanel>;

withInstaller.install = (app: App): void => {
  app.component(CascaderPanel.name, CascaderPanel);
};

export default withInstaller;
export const LpCascaderPanel = withInstaller;
export * from './src/types';
export * from './src/config';

import Cascader from './src/Cascader.vue';
import type { App } from 'vue';
import type { SFCWithInstall } from '@lemon-peel/utils';

const withInstaller = Cascader as SFCWithInstall<typeof Cascader>;

withInstaller.install = (app: App): void => {
  app.component(Cascader.name, Cascader);
};


export default withInstaller;
export const LpCascader = withInstaller;

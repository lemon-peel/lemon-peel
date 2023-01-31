import CollapseTransition from './src/collapse-transition.vue';
import type { App } from 'vue';
import type { SFCWithInstall } from '@lemon-peel/utils';

const withInstaller = CollapseTransition as SFCWithInstall<typeof CollapseTransition>;

withInstaller.install = (app: App): void => {
  app.component(CollapseTransition.name, CollapseTransition);
};

export default withInstaller;
export const LpCollapseTransition = withInstaller;

import InfiniteScroll from './src';

import type { App } from 'vue';
import type { SFCWithInstall } from '@lemon-peel/utils';

const withInstaller = InfiniteScroll as SFCWithInstall<typeof InfiniteScroll>;

withInstaller.install = (app: App) => {
  app.directive('InfiniteScroll', withInstaller);
};

export default withInstaller;

export const LpInfiniteScroll = withInstaller;

import { Loading } from './src/service';
import { vLoading } from './src/directive';

import type { App } from 'vue';

// installer and everything in all
export const LpLoading = {
  install(app: App) {
    app.directive('loading', vLoading);
    app.config.globalProperties.$loading = Loading;
  },
  directive: vLoading,
  service: Loading,
};

export default LpLoading;


export * from './src/types';

export { vLoading, vLoading as LpLoadingDirective } from './src/directive';
export { Loading as LpLoadingService } from './src/service';
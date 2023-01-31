import TimeSelect from './src/TimeSelect.vue';

import type { App } from 'vue';
import type { SFCWithInstall } from '@lemon-peel/utils';

const withInstaller = TimeSelect as SFCWithInstall<typeof TimeSelect>;

withInstaller.install = (app: App): void => {
  app.component(TimeSelect.name, TimeSelect);
};

export default withInstaller;
export const LpTimeSelect = withInstaller;

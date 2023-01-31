import DatePicker from './src/DatePicker';

import type { App } from 'vue';
import type { SFCWithInstall } from '@lemon-peel/utils';

const withInstaller = DatePicker as SFCWithInstall<typeof DatePicker>;

withInstaller.install = (app: App) => {
  app.component(withInstaller.name, withInstaller);
};

export default withInstaller;
export const LpDatePicker = withInstaller;

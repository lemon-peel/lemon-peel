import DatePicker from './src/DatePicker.vue';

import type { App } from 'vue';
import type { SFCWithInstall } from '@lemon-peel/utils';

export type { Shortcut } from './src/datePicker.type';

const withInstaller = DatePicker as SFCWithInstall<typeof DatePicker>;

withInstaller.install = (app: App) => {
  app.component(withInstaller.name, withInstaller);
};

export default withInstaller;
export const LpDatePicker = withInstaller;

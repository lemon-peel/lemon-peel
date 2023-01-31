import TimePicker from './src/TimePicker';


import type { App } from 'vue';
import type { SFCWithInstall } from '@lemon-peel/utils';

export * from './src/utils';
export * from './src/constants';
export * from './src/common/props';

const withInstaller = TimePicker as SFCWithInstall<typeof TimePicker>;

withInstaller.install = (app: App) => {
  app.component(withInstaller.name, withInstaller);
};


export default withInstaller;
export const LpTimePicker = withInstaller;

export { default as CommonPicker } from './src/common/Picker.vue';
export { default as TimePickPanel } from './src/timePickerCom/PanelTimePick.vue';
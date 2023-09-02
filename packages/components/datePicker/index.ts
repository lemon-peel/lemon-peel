import DatePicker from './src/DatePicker.vue';

import { withInstall } from '@lemon-peel/utils';

export const LpDatePicker = withInstall(DatePicker);

export default LpDatePicker;

export * from './src/datePicker.type';
export * from './src/props/datePicker';

export type DatePickerInst = InstanceType<typeof DatePicker>;

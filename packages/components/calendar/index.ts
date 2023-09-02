import { withInstall } from '@lemon-peel/utils';
import Calendar from './src/Calendar.vue';

export const LpCalendar = withInstall(Calendar);
export default LpCalendar;

export * from './src/calendar';

export type CalendarInst = InstanceType<typeof Calendar>;

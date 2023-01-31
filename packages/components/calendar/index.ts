import { withInstall } from '@lemon-peel/utils';
import Calendar from './src/Calendar.vue';

export const LpCalendar = withInstall(Calendar);
export default LpCalendar;

export type {
  CalendarDateTableInstance,
  DateTableInstance,
} from './src/instance';

export * from './src/calendar';

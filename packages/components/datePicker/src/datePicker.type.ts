import type { Dayjs } from 'dayjs';
import type { SetupContext } from 'vue';

export declare type IDatePickerType =
  | 'year'
  | 'month'
  | 'date'
  | 'dates'
  | 'week'
  | 'datetime'
  | 'datetimerange'
  | 'daterange'
  | 'monthrange';

type DateCellType = 'normal' | 'today' | 'week' | 'next-month' | 'prev-month';

export type Shortcut = {
  text: string;
  value: Date | [Date, Date] | (() => Date) | (() => [Date, Date]);
  onClick?: (ctx: Omit<SetupContext, 'expose'>) => void;
};

export interface DateCell {
  column?: number;
  customClass?: string;
  disabled?: boolean;
  end?: boolean;
  inRange?: boolean;
  row?: number;
  selected?: Dayjs;
  isCurrent?: boolean;
  isSelected?: boolean;
  start?: boolean;
  text?: number;
  timestamp?: number;
  date?: Date;
  dayjs?: Dayjs;
  type?: DateCellType;
}

import { buildProps, isArray, isDate } from '@lemon-peel/utils';
import { INPUT_EVENT, UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import type { ExtractPropTypes, PropType } from 'vue';

export type CalendarDateType =
  | 'prev-month'
  | 'next-month'
  | 'prev-year'
  | 'next-year'
  | 'today';

const isValidRange = (range: unknown): range is [Date, Date] =>
  isArray(range) && range.length === 2 && range.every(item => isDate(item));

export const calendarProps = buildProps({
  value: { type: Date },
  range: { type: Array as unknown as PropType<[Date, Date]>, validator: isValidRange },
});
export type CalendarProps = ExtractPropTypes<typeof calendarProps>;

export const calendarEmits = {
  [UPDATE_MODEL_EVENT]: (value: Date) => isDate(value),
  [INPUT_EVENT]: (value: Date) => isDate(value),
};
export type CalendarEmits = typeof calendarEmits;

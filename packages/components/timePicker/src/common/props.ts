import { buildProps } from '@lemon-peel/utils';
import { useSizeProp } from '@lemon-peel/hooks';
import { CircleClose } from '@element-plus/icons-vue';
import { disabledTimeListsProps } from '../props/shared';

import type { Component, ExtractPropTypes, PropType } from 'vue';
import type { Options } from '@popperjs/core';
import type { Dayjs } from 'dayjs';

export type SingleOrRange<T> = T | [T, T];
export type DateModelType = number | string | Date;
export type ModelValueType = SingleOrRange<DateModelType>;
export type DayOrDays = SingleOrRange<Dayjs>;
export type DateOrDates = SingleOrRange<Date>;
export type UserInput = SingleOrRange<string | null>;
export type GetDisabledHours = (role: string, comparingDate?: Dayjs) => number[];

export type GetDisabledMinutes = (
  hour: number,
  role: string,
  comparingDate?: Dayjs
) => number[];

export type GetDisabledSeconds = (
  hour: number,
  minute: number,
  role: string,
  comparingDate?: Dayjs
) => number[];

export const timePickerDefaultProps = buildProps({
  id: { type: [Array, String] as PropType<SingleOrRange<string>> },
  name: { type: [Array, String] as PropType<SingleOrRange<string>>, default: '' },
  popperClass: { type: String, default: '' },
  format: String,
  valueFormat: String,
  type: { type: String, default: '' },
  clearable: { type: Boolean, default: true },
  clearIcon: { type: [String, Object] as PropType<string | Component>, default: CircleClose },
  editable: { type: Boolean, default: true },
  prefixIcon: { type: [String, Object] as PropType<string | Component>, default: '' },
  size: useSizeProp,
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
  popperOptions: { type: Object as PropType<Partial<Options>>, default: () => ({}) },
  modelValue: { type: [Date, Array, String, Number] as PropType<ModelValueType>, default: '' },
  rangeSeparator: { type: String, default: '-' },
  startPlaceholder: String,
  endPlaceholder: String,
  defaultValue: { type: [Date, Array] as PropType<SingleOrRange<Date>> },
  defaultTime: { type: [Date, Array] as PropType<SingleOrRange<Date>> },
  isRange: { type: Boolean, default: false },
  ...disabledTimeListsProps,
  disabledDate: { type: Function },
  cellClassName: { type: Function },
  shortcuts: { type: Array, default: () => [] },
  arrowControl: { type: Boolean, default: false },
  label: { type: String, default: undefined },
  tabindex: { type: [String, Number] as PropType<string | number>, default: 0 },
  validateEvent: { type: Boolean, default: true },
  unlinkPanels: Boolean,
} as const);

export type TimePickerDefaultProps = ExtractPropTypes<typeof timePickerDefaultProps>;

export interface PickerOptions {
  isValidValue: (date: DayOrDays) => boolean;
  handleKeydownInput: (event: KeyboardEvent) => void;
  parseUserInput: (value: UserInput) => DayOrDays;
  formatToString: (value: DayOrDays) => UserInput;
  getRangeAvailableTime: (date: DayOrDays) => DayOrDays;
  getDefaultValue: () => DayOrDays;
  panelReady: boolean;
  handleClear: () => void;
  handleFocusPicker?: () => void;
}

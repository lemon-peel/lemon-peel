import { buildProps, isArray } from '@lemon-peel/utils';
import { datePickTypes } from '@lemon-peel/constants';

import type { ExtractPropTypes, PropType } from 'vue';
import type { Dayjs } from 'dayjs';
import type { DatePickType } from '@lemon-peel/constants';

const selectionModes = ['date', 'dates', 'year', 'month', 'week', 'range'];

export type RangeState = {
  endDate: null | Dayjs;
  selecting: boolean;
};

export const datePickerSharedProps = buildProps({
  disabledDate: {
    type: Function as PropType<(date: Date) => boolean>,
  },
  date: {
    type: Object as PropType<Dayjs>,
    required: true,
  },
  minDate: {
    type: Object as PropType<Dayjs | null>,
  },
  maxDate: {
    type: Object as PropType<Dayjs | null>,
  },
  parsedValue: {
    type: [Object, Array] as PropType<Dayjs | Dayjs[]>,
  },
  rangeState: {
    type: Object as PropType<RangeState>,
    default: () => ({
      endDate: null,
      selecting: false,
    }),
  },
} as const);

export const panelSharedProps = buildProps({
  type: {
    type: String as PropType<DatePickType>,
    required: true,
    values: datePickTypes,
  },
} as const);

export const panelRangeSharedProps = buildProps({
  unlinkPanels: Boolean,
  parsedValue: {
    type: Array as PropType<Dayjs[]>,
  },
} as const);

export const selectionModeWithDefault = (
  mode: typeof selectionModes[number],
) => {
  return {
    type: String,
    values: selectionModes,
    default: mode,
  };
};

export const rangePickerSharedEmits = {
  pick: (range: [Dayjs, Dayjs]) => isArray(range),
};

export type RangePickerSharedEmits = typeof rangePickerSharedEmits;
export type PanelRangeSharedProps = ExtractPropTypes<
  typeof panelRangeSharedProps
>;

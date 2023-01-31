import { buildProps, definePropType, isArray } from '@lemon-peel/utils';
import { datePickTypes } from '@lemon-peel/constants';

import type { ExtractPropTypes } from 'vue';
import type { Dayjs } from 'dayjs';
import type { DatePickType } from '@lemon-peel/constants';

const selectionModes = ['date', 'dates', 'year', 'month', 'week', 'range'];

export type RangeState = {
  endDate: null | Dayjs
  selecting: boolean
};

export const datePickerSharedProps = buildProps({
  disabledDate: {
    type: definePropType<(date: Date) => boolean>(Function),
  },
  date: {
    type: definePropType<Dayjs>(Object),
    required: true,
  },
  minDate: {
    type: definePropType<Dayjs | null>(Object),
  },
  maxDate: {
    type: definePropType<Dayjs | null>(Object),
  },
  parsedValue: {
    type: definePropType<Dayjs | Dayjs[]>([Object, Array]),
  },
  rangeState: {
    type: definePropType<RangeState>(Object),
    default: () => ({
      endDate: null,
      selecting: false,
    }),
  },
} as const);

export const panelSharedProps = buildProps({
  type: {
    type: definePropType<DatePickType>(String),
    required: true,
    values: datePickTypes,
  },
} as const);

export const panelRangeSharedProps = buildProps({
  unlinkPanels: Boolean,
  parsedValue: {
    type: definePropType<Dayjs[]>(Array),
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

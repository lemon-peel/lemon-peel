import { buildProps } from '@lemon-peel/utils';
import { disabledTimeListsProps } from './shared';

import type { ExtractPropTypes } from 'vue';
import type { Dayjs } from 'dayjs';

export const basicTimeSpinnerProps = buildProps({
  role: {
    type: String,
    required: true,
  },
  spinnerDate: {
    type: Object as PropType<Dayjs>,
    required: true,
  },
  showSeconds: {
    type: Boolean,
    default: true,
  },
  arrowControl: Boolean,
  amPmMode: {
    // 'a': am/pm; 'A': AM/PM
    type: String as PropType<'a' | 'A' | ''>,
    default: '',
  },
  ...disabledTimeListsProps,
} as const);

export type BasicTimeSpinnerProps = ExtractPropTypes<
  typeof basicTimeSpinnerProps
>;

import { buildProps, definePropType } from '@lemon-peel/utils';

import type { ExtractPropTypes } from 'vue';
import type { IDatePickerType } from '../datePicker.type';

export const datePickerProps = buildProps({
  type: {
    type: definePropType<IDatePickerType>(String),
    default: 'date',
  },
} as const);

export type DatePickerProps = ExtractPropTypes<typeof datePickerProps>;

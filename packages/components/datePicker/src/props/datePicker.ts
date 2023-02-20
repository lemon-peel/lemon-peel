import { buildProps } from '@lemon-peel/utils';

import type { ExtractPropTypes, PropType } from 'vue';
import type { IDatePickerType } from '../datePicker.type';

export const datePickerProps = buildProps({
  type: { type: String as PropType<IDatePickerType>, default: 'date' },
});

export type DatePickerProps = ExtractPropTypes<typeof datePickerProps>;

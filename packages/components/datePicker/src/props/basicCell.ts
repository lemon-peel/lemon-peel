import { buildProps, definePropType } from '@lemon-peel/utils';

import type { ExtractPropTypes } from 'vue';
import type { DateCell } from '../datePicker.type';

export const basicCellProps = buildProps({
  cell: {
    type: definePropType<DateCell>(Object),
  },
} as const);

export type BasicCellProps = ExtractPropTypes<typeof basicCellProps>;

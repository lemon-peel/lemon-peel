import { buildProps } from '@lemon-peel/utils';

import type { ExtractPropTypes, PropType } from 'vue';
import type { DateCell } from '../datePicker.type';

export const basicCellProps = buildProps({
  cell: { type: Object as PropType<DateCell> },
});

export type BasicCellProps = ExtractPropTypes<typeof basicCellProps>;

import { buildProps } from '@lemon-peel/utils';
import { column } from './common';

import type { ExtractPropTypes, StyleValue } from 'vue';

export const tableV2CellProps = buildProps({
  class: String,
  cellData: {
    type: [String, Boolean, Number, Object] as PropType<any>,
  },
  column,
  columnIndex: Number,
  style: {
    type: [String, Array, Object] as PropType<StyleValue>,
  },
  rowData: {
    type: Object as PropType<any>,
  },
  rowIndex: Number,
} as const);

export type TableV2CellProps = ExtractPropTypes<typeof tableV2CellProps>;

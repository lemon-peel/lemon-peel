import { buildProps } from '@lemon-peel/utils';
import { columns } from './common';

import type { ExtractPropTypes } from 'vue';

const requiredNumberType = {
  type: Number,
  required: true,
} as const;

export const tableV2HeaderProps = buildProps({
  class: String,
  columns,
  fixedHeaderData: {
    type: Array as PropType<any[]>,
  },
  headerData: {
    type: Array as PropType<any[]>,
    required: true,
  },
  headerHeight: {
    type: [Number, Array] as PropType<number | number[]>,
    default: 50,
  },
  rowWidth: requiredNumberType,
  rowHeight: {
    type: Number,
    default: 50,
  },
  height: requiredNumberType,
  width: requiredNumberType,
} as const);

export type TableV2HeaderProps = ExtractPropTypes<typeof tableV2HeaderProps>;

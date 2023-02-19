import { buildProps } from '@lemon-peel/utils';

import type { ExtractPropTypes, PropType } from 'vue';
import type { ColumnCls, ColumnStyle } from '../table/defaults';

export const tableBodyProps = buildProps({
  stripe: Boolean,
  tooltipEffect: String,
  rowClassName: { type: [String, Function] as PropType<ColumnCls> },
  rowStyle: { type: [Object, Function] as PropType<ColumnStyle> },
  fixed: {
    type: String,
    default: '',
  },
  highlight: Boolean,
});

export type TableBodyProps = Readonly<ExtractPropTypes<typeof tableBodyProps>>;

import { buildProps } from '@lemon-peel/utils';
import { columns } from './common';

import type { CSSProperties, ExtractPropTypes } from 'vue';
import type { KeyType } from './types';

export const tableV2HeaderRowProps = buildProps({
  class: String,
  columns,
  columnsStyles: {
    type: Object as PropType<Record<KeyType, CSSProperties>>,
    required: true,
  },
  headerIndex: Number,
  style: { type: Object as PropType<CSSProperties> },
} as const);

export type TableV2HeaderRowProps = ExtractPropTypes<
  typeof tableV2HeaderRowProps
>;

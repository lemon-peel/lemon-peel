import { buildProps } from '@lemon-peel/utils';
import { virtualizedGridProps } from '@lemon-peel/components/virtualList';
import { columns, expandColumnKey, rowKey } from './common';

import type { CSSProperties, ExtractPropTypes } from 'vue';
import type { FixedDirection, KeyType, RowCommonParams } from './types';

export type RowExpandParams = {
  expanded: boolean;
  rowKey: KeyType;
} & RowCommonParams;

export type RowHoverParams = {
  event: MouseEvent;
  hovered: boolean;
  rowKey: KeyType;
} & RowCommonParams;

export type RowEventHandlerParams = {
  rowKey: KeyType;
  event: Event;
} & RowCommonParams;

export type RowHeightChangedParams = {
  rowKey: KeyType;
  height: number;
  rowIndex: number;
};

export type RowExpandHandler = (params: RowExpandParams) => void;
export type RowHoverHandler = (params: RowHoverParams) => void;
export type RowEventHandler = (params: RowEventHandlerParams) => void;
export type RowHeightChangeHandler = (
  row: RowHeightChangedParams,
  fixedDirection: boolean | FixedDirection | undefined
) => void;

export type RowEventHandlers = {
  onClick?: RowEventHandler;
  onContextmenu?: RowEventHandler;
  onDblclick?: RowEventHandler;
  onMouseenter?: RowEventHandler;
  onMouseleave?: RowEventHandler;
};

export const tableV2RowProps = buildProps({
  class: String,
  columns,
  columnsStyles: {
    type: Object as PropType<Record<KeyType, CSSProperties>>,
    required: true,
  },
  depth: Number,
  expandColumnKey,
  estimatedRowHeight: {
    ...virtualizedGridProps.estimatedRowHeight,
    default: undefined,
  },
  isScrolling: Boolean,
  onRowExpand: {
    type: Function as PropType<RowExpandHandler>,
  },
  onRowHover: {
    type: Function as PropType<RowHoverHandler>,
  },
  onRowHeightChange: {
    type: Function as PropType<RowHeightChangeHandler>,
  },
  rowData: {
    type: Object as PropType<any>,
    required: true,
  },
  rowEventHandlers: {
    type: Object as PropType<RowEventHandlers>,
  },
  rowIndex: {
    type: Number,
    required: true,
  },
  /**
   * Unique item key
   */
  rowKey,
  style: {
    type: Object as PropType<CSSProperties>,
  },
} as const);

export type TableV2RowProps = ExtractPropTypes<typeof tableV2RowProps>;

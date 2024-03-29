import { buildProps } from '@lemon-peel/utils';
import { virtualizedGridProps, virtualizedListProps } from '@lemon-peel/components/virtualList';
import { classType, columns, dataType, fixedDataType, requiredNumber, styleType } from './common';
import { tableV2HeaderProps } from './header';
import { tableV2RowProps } from './row';

import type { ExtractPropTypes, PropType } from 'vue';
import type { ItemSize } from '@lemon-peel/components/virtualList';

export type OnRowRenderedParams = {
  rowCacheStart: number;
  rowCacheEnd: number;
  rowVisibleStart: number;
  rowVisibleEnd: number;
};

export const tableV2GridProps = buildProps({
  columns,
  data: dataType,
  fixedData: fixedDataType,
  estimatedRowHeight: tableV2RowProps.estimatedRowHeight,

  /**
   * Size related attributes
   */
  width: requiredNumber,
  height: requiredNumber,

  headerWidth: requiredNumber,
  headerHeight: tableV2HeaderProps.headerHeight,

  bodyWidth: requiredNumber,
  rowHeight: requiredNumber,

  /**
   * Special attributes
   */
  cache: virtualizedListProps.cache,
  useIsScrolling: Boolean,
  scrollbarAlwaysOn: virtualizedGridProps.scrollbarAlwaysOn,
  scrollbarStartGap: virtualizedGridProps.scrollbarStartGap,
  scrollbarEndGap: virtualizedGridProps.scrollbarEndGap,

  /**
   * CSS attributes
   */
  class: classType,
  style: styleType,
  containerStyle: styleType,

  getRowHeight: {
    type: Function as PropType<ItemSize>,
    required: true,
  },
  rowKey: tableV2RowProps.rowKey,

  /**
   * Event handlers
   */
  onRowsRendered: {
    type: Function as PropType<(params: OnRowRenderedParams) => void>,
  },
  onScroll: {
    type: Function as PropType<(...args: any[]) => void>,
  },
} as const);

export type TableV2GridProps = ExtractPropTypes<typeof tableV2GridProps>;

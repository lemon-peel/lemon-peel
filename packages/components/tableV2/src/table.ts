import { buildProps } from '@lemon-peel/utils';
import { virtualizedGridProps, virtualizedScrollbarProps } from '@lemon-peel/components/virtualList';

import { classType, columns, dataType, expandKeys, fixedDataType, requiredNumber, rowKey } from './common';
import { tableV2RowProps } from './row';
import { tableV2HeaderProps } from './header';
import { tableV2GridProps } from './grid';

import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import type { SortOrder } from './constants';
import type { Column, ColumnCommonParams, DataGetter, KeyType, RowCommonParams, SortBy, SortState } from './types';

/**
 * Param types
 */
export type ColumnSortParams<T> = {
  column: Column<T>;
  key: KeyType;
  order: SortOrder;
};

/**
 * Renderer/Getter types
 */

export type ExtraCellPropGetter<T> = (
  params: ColumnCommonParams<T> &
  RowCommonParams & { cellData: T, rowData: any }
) => any;

export type ExtractHeaderPropGetter<T> = (params: {
  columns: Column<T>[];
  headerIndex: number;
}) => any;

export type ExtractHeaderCellPropGetter<T> = (
  params: ColumnCommonParams<T> & { headerIndex: number }
) => any;

export type ExtractRowPropGetter<T> = (
  params: { columns: Column<T>[] } & RowCommonParams
) => any;

export type HeaderClassNameGetter<T> = (params: {
  columns: Column<T>[];
  headerIndex: number;
}) => string;

export type RowClassNameGetter<T> = (
  params: { columns: Column<T>[] } & RowCommonParams
) => string;

/**
 * Handler types
 */
export type ColumnSortHandler<T> = (params: ColumnSortParams<T>) => void;
export type ColumnResizeHandler<T> = (column: Column<T>, width: number) => void;
export type ExpandedRowsChangeHandler = (expandedRowKeys: KeyType[]) => void;

export const tableV2Props = buildProps({
  cache: tableV2GridProps.cache,
  estimatedRowHeight: tableV2RowProps.estimatedRowHeight,
  rowKey,
  // Header attributes
  headerClass: { type: [String, Function] as PropType<string | HeaderClassNameGetter<any>> },
  headerProps: { type: [Object, Function] as PropType<any | ExtractHeaderPropGetter<any>> },
  headerCellProps: { type: [Object, Function] as PropType<any | ExtractHeaderCellPropGetter<any>> },
  headerHeight: tableV2HeaderProps.headerHeight,
  /**
   * Footer attributes
   */
  footerHeight: { type: Number, default: 0 },
  /**
   * Row attributes
   */
  rowClass: { type: [String, Function] as PropType<string | RowClassNameGetter<any>> },
  rowProps: { type: [Object, Function] as PropType<ExtractRowPropGetter<any> | any> },
  rowHeight: { type: Number, default: 50 },

  /**
   * Cell attributes
   */
  cellProps: { type: [Object, Function] as PropType<Record<string, any> | ExtraCellPropGetter<any>> },
  /**
   * Data models
   */
  columns,
  data: dataType,
  dataGetter: { type: Function as PropType<DataGetter<any>> },
  fixedData: fixedDataType,
  /**
   * Expanded keys
   */
  expandColumnKey: tableV2RowProps.expandColumnKey,
  expandedRowKeys: expandKeys,
  defaultExpandedRowKeys: expandKeys,

  /**
   * Attributes
   */
  class: classType,
  // disabled: Boolean,
  fixed: Boolean,
  style: { type: Object as PropType<CSSProperties> },
  width: requiredNumber,
  height: requiredNumber,
  maxHeight: Number,
  useIsScrolling: Boolean,
  indentSize: { type: Number, default: 12 },
  iconSize: { type: Number, default: 12 },
  hScrollbarSize: virtualizedGridProps.hScrollbarSize,
  vScrollbarSize: virtualizedGridProps.vScrollbarSize,
  scrollbarAlwaysOn: virtualizedScrollbarProps.alwaysOn,

  /**
   * Sorting
   */
  sortBy: {
    type: Object as PropType<SortBy>,
    default: () => ({} as { key: KeyType, order: SortOrder }),
  },
  sortState: { type: Object as PropType<SortState>, default: undefined },

  /**
   * Handlers
   */
  onColumnSort: { type: Function as PropType<ColumnSortHandler<any>> },
  onExpandedRowsChange: { type: Function as PropType<ExpandedRowsChangeHandler> },
  onEndReached: { type: Function as PropType<(distance: number) => void> },
  onRowExpand: tableV2RowProps.onRowExpand,
  onScroll: tableV2GridProps.onScroll,
  onRowsRendered: tableV2GridProps.onRowsRendered,
  rowEventHandlers: tableV2RowProps.rowEventHandlers,
});

export type TableV2Props = ExtractPropTypes<typeof tableV2Props>;

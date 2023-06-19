
import { buildProps } from '@lemon-peel/utils';

import type { ExtractPropTypes, ComponentInternalInstance, PropType, Ref, VNode, VNodeChild } from 'vue';
import type { Placement } from '@lemon-peel/components/popper';
import type { RenderHeaderData, RenderRowData } from '../table/defaults';
import type { DefaultRow, TableVM } from '../table/defaults';
import type { SortBy } from '../util';

export type Filter = {
  text: string;
  value: string;
};

export type Filters = Filter[];

export type FilterMethods = (value: any, row: DefaultRow, column: TableColumnCtx) => void;

export type ValueOf<T> = T[keyof T];

export interface TableColumnCtx {
  id: string;

  type: string;
  label: string;
  className: string;
  labelClassName: string;
  property: string;
  prop: string;

  width?: string | number;
  realWidth: number | null;
  minWidth: string | number;
  realMinWidth: string | number;

  renderHeader: (data: RenderHeaderData) => VNodeChild;
  sortable: boolean | string;
  sortMethod: (a: DefaultRow, b: DefaultRow) => number;
  sortBy: SortBy;
  resizable: boolean;
  columnKey: string;
  rawColumnKey: string;
  align: string;
  headerAlign: string;
  showTooltipWhenOverflow: boolean;
  showOverflowTooltip: boolean;
  fixed: boolean | string;
  formatter: (row: DefaultRow, column: TableColumnCtx, cellValue: any, index: number) => VNode | string;
  selectable: (row: DefaultRow, index: number) => boolean;
  reserveSelection: boolean;
  filterMethod: FilterMethods;
  filteredValue: string[];
  filters: Filters;
  filterPlacement: Placement;
  filterMultiple: boolean;
  index: number | ((index: number) => number);
  sortOrders: ('ascending' | 'descending' | null)[];
  renderCell: (data: RenderRowData) => VNodeChild;
  colSpan: number;
  rowSpan: number;
  children?: TableColumnCtx[];
  level: number;
  filterable: boolean | FilterMethods | Filters;
  order: 'ascending' | 'descending' | null;
  isColumnGroup: boolean;
  isSubColumn: boolean;
  columns: TableColumnCtx[];
  getColumnIndex: () => number;
  no: number;
  filterOpened?: boolean;
}

export interface TableColumn extends ComponentInternalInstance {
  vnode: {
    vParent: TableColumn | TableVM;
  } & VNode;
  vParent: TableColumn | TableVM;
  columnId: string;
  columnConfig: Ref<Partial<TableColumnCtx>>;
}

export const tableColumnProps = buildProps({
  type: { type: String, default: 'default' },
  label: String,
  className: String,
  labelClassName: String,
  property: String,
  prop: String,
  width: { type: [String, Number], default: '' },
  minWidth: { type: [String, Number], default: '' },
  renderHeader: { type: Function as PropType<TableColumnCtx['renderHeader']> },
  sortable: { type: [Boolean, String], default: false },
  sortMethod: { type: Function as PropType<TableColumnCtx['sortMethod']> },
  sortBy: { type: [String, Function, Array] as PropType<TableColumnCtx['sortBy']> },
  resizable: { type: Boolean, default: true },
  columnKey: String,
  align: String,
  headerAlign: String,
  showTooltipWhenOverflow: Boolean,
  showOverflowTooltip: Boolean,
  fixed: { type: [Boolean, String] },
  formatter: { type: Function as PropType<TableColumnCtx['formatter']> },
  selectable: { type: Function as PropType<TableColumnCtx['selectable']> },
  reserveSelection: Boolean,
  filterMethod: { type: Function as PropType<TableColumnCtx['filterMethod']> },
  filteredValue: { type: Array as PropType<TableColumnCtx['filteredValue']> },
  filters: { type: Array as PropType<TableColumnCtx['filters']> },
  filterPlacement: String,
  filterOpened: Boolean,
  filterMultiple: { type: Boolean, default: true },
  index: { type: [Number, Function] as PropType<TableColumnCtx['index']> },
  sortOrders: {
    type: Array as PropType<TableColumnCtx['sortOrders']>,
    default: () => {
      return ['ascending', 'descending', null];
    },
    validator: (val: TableColumnCtx['sortOrders']) => {
      return val.every((order: any) =>
        ['ascending', 'descending', null].includes(order),
      );
    },
  },
});

export type TableColumnProps = Readonly<ExtractPropTypes<typeof tableColumnProps>>;
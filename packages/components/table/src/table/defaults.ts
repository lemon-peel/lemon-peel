import type { CssNamespace } from './../../../../hooks/useNamespace/index';
import { buildProp, buildProps } from '@lemon-peel/utils';
import { componentSizes } from '@lemon-peel/constants';

import type { CSSProperties, ComponentInternalInstance, ExtractPropTypes, PropType, Ref, SetupContext, VNode } from 'vue';
import type { TableColumnCtx } from '../tableColumn/defaults';
import type { Store } from '../store';
import type TableLayout from '../layout/TableLayout';

export type DefaultRow = Record<string, any>;


export const useSizeProp = buildProp({
  type: String,
  values: componentSizes,
  required: false,
} as const);

export interface TableRefs {
  tableWrapper: HTMLElement;
  headerWrapper: HTMLElement;
  footerWrapper: HTMLElement;
  fixedBodyWrapper: HTMLElement;
  rightFixedBodyWrapper: HTMLElement;
  bodyWrapper: HTMLElement;
  [key: string]: any;
}

interface TableState {
  isGroup: Ref<boolean>;
  resizeState: Ref<{
    width: any;
    height: any;
  }>;
  doLayout: () => void;
  debouncedUpdateLayout: () => void;
}

type HoverState = ({
  cell: HTMLElement;
  column: TableColumnCtx;
  row: DefaultRow;
}) | null;

export type RenderExpanded = (data: { row: DefaultRow, rowIndex: number, store: Store, expanded?: boolean }) => VNode | null;

export type SummaryMethod = (data: { columns: TableColumnCtx[], data: DefaultRow[] }) => string[];

export type TableExpose = {
  updateTableScrollY: () => void;
  $ready: boolean;
  hoverState?: HoverState;
  renderExpanded: RenderExpanded;
  layout: TableLayout;
  refs: TableRefs;
  ns: CssNamespace;
  tableId: string;
  state: TableState;
};

export type TableVM = ComponentInternalInstance & TableExpose;

export type ColumnCls = string | ((data: { row: DefaultRow, rowIndex: number }) => string);

export type ColumnStyle =
  | CSSProperties
  | ((data: { row: DefaultRow, rowIndex: number }) => CSSProperties);

type CellCls =
  | string
  | ((data: {
    row: DefaultRow;
    rowIndex: number;
    column: TableColumnCtx;
    columnIndex: number;
  }) => string);

type CellStyle =
  | CSSProperties
  | ((data: {
    row: DefaultRow;
    rowIndex: number;
    column: TableColumnCtx;
    columnIndex: number;
  }) => CSSProperties);

type Layout = 'fixed' | 'auto';

export type SpanMethod = {
  (data: {
    row: DefaultRow;
    rowIndex: number;
    column: TableColumnCtx;
    columnIndex: number;
  }): (
    number[]
    | { rowspan: number, colspan: number }
  );
};

export type TableLoadFunc = (row: DefaultRow, data: any[], resolve: (data: DefaultRow[]) => void) => DefaultRow;

export interface Sort {
  prop: string;
  order: 'ascending' | 'descending';
  init?: any;
  silent?: any;
}

export interface Filter {
  column: TableColumnCtx | TableColumnCtx[];
  values: string[];
  silent: any;
  multi?: boolean;
}

export interface TreeNode {
  children: string[];

  expanded?: boolean;
  loading?: boolean;
  loaded?: boolean;

  lazy?: boolean;
  noLazyChildren?: boolean;

  indent?: number;
  level?: number;
  display?: boolean;
}

export interface RenderHeaderData {
  store?: Store;
  column: TableColumnCtx;
  cellIndex: number;
}

export interface RenderRowData {
  store: Store;
  table: TableVM;
  row: DefaultRow;
  rowIndex: number;
  cellIndex: number;
  column: TableColumnCtx;
  treeNode?: TreeNode;
  expanded: boolean;
}

export const tableProps = buildProps({
  data: { type: Array as PropType<DefaultRow[]>, default: () => [] },
  size: useSizeProp,
  width: { type: [String, Number], default: undefined },
  height: { type: [String, Number], default: undefined },
  maxHeight: { type: [String, Number], default: undefined },
  fit: { type: Boolean, default: true },
  stripe: Boolean,
  border: Boolean,
  rowKey: { type: [String, Function] as PropType<string | ((row: object) => string)>, required: true },
  showHeader: { type: Boolean, default: true },
  showSummary: Boolean,
  sumText: String,
  summaryMethod: { type: Function as PropType<SummaryMethod> },
  rowClassName: { type: [String, Function] as PropType<ColumnCls> },
  rowStyle: { type: [Object, Function] as PropType<ColumnStyle> },
  cellClassName: { type: [String, Function] as PropType<CellCls> },
  cellStyle: { type: [Object, Function] as PropType<CellStyle> },
  headerRowClassName: { type: [String, Function] as PropType<ColumnCls> },
  headerRowStyle: { type: [Object, Function] as PropType<ColumnStyle> },
  headerCellClassName: { type: [String, Function] as PropType<CellCls> },
  headerCellStyle: { type: [Object, Function] as PropType<CellStyle> },
  highlightCurrentRow: Boolean,
  currentRowKey: { type: [String, Number] },
  emptyText: String,
  expandRowKeys: { type: Array as PropType<any[]> },
  defaultExpandAll: Boolean,
  defaultSort: { type: Object as PropType<Sort> },
  tooltipEffect: String,
  spanMethod: { type: Function as PropType<SpanMethod | undefined> },
  selectOnIndeterminate: { type: Boolean, default: true },
  indent: { type: Number, default: 16 },
  treeProps: {
    type: Object as PropType<{ hasChildren?: string, children?: string }>,
    default: () => ({ hasChildren: 'hasChildren', children: 'children' }),
  },
  lazy: Boolean,
  load: { type: Function as PropType<TableLoadFunc> },
  style: { type: Object as PropType<CSSProperties>, default: () => ({}) },
  className: { type: String, default: '' },
  tableLayout: { type: String as PropType<Layout>, default: 'fixed' },
  scrollbarAlwaysOn: { type: Boolean, default: false },
  flexible: Boolean,
});

export type TableProps = Readonly<ExtractPropTypes<typeof tableProps>>;

export const tableEmits = [
  'select',
  'select-all',
  'selection-change',
  'cell-mouse-enter',
  'cell-mouse-leave',
  'cell-contextmenu',
  'cell-click',
  'cell-dblclick',
  'row-click',
  'row-contextmenu',
  'row-dblclick',
  'header-click',
  'header-contextmenu',
  'sort-change',
  'filter-change',
  'current-change',
  'header-dragend',
  'expand-change',
];

export type TableEmit = SetupContext<typeof tableEmits>['emit'];

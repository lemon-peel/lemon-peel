
import type { CSSProperties, ComponentInternalInstance, PropType, Ref, SetupContext, VNode } from 'vue';

import type { Store } from '../store';
import type { TableColumnCtx } from '../tableColumn/defaults';
import type TableLayout from '../tableLayout';

export type DefaultRow = Record<string, any>;

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

type HoverState<T> = ({
  cell: HTMLElement;
  column: TableColumnCtx<T>;
  row: T;
}) | null;

type RIS<T> = { row: T, $index: number, store: Store<T>, expanded: boolean };

type RenderExpanded<T> = (ris: RIS<T>) => VNode;

export type SummaryMethod<T = DefaultRow> = (data: { columns: TableColumnCtx<T>[], data: T[] }) => string[];

export type TableExpose<T = DefaultRow> = {
  $ready: boolean;
  hoverState?: HoverState<T>;
  renderExpanded: RenderExpanded<T>;
  layout: TableLayout<T>;
  refs: TableRefs;
  tableId: string;
  state: TableState;
};

export type TableVM = ComponentInternalInstance & TableExpose;

export type ColumnCls<T> = string | ((data: { row: T, rowIndex: number }) => string);

export type ColumnStyle<T> =
  | CSSProperties
  | ((data: { row: T, rowIndex: number }) => CSSProperties);

type CellCls<T> =
  | string
  | ((data: {
    row: T;
    rowIndex: number;
    column: TableColumnCtx<T>;
    columnIndex: number;
  }) => string);

type CellStyle<T> =
  | CSSProperties
  | ((data: {
    row: T;
    rowIndex: number;
    column: TableColumnCtx<T>;
    columnIndex: number;
  }) => CSSProperties);

type Layout = 'fixed' | 'auto';

export interface TableProps<T> {
  data: T[];
  size?: string;
  width?: string | number;
  height?: string | number;
  maxHeight?: string | number;
  fit?: boolean;
  stripe?: boolean;
  border?: boolean;
  rowKey?: string | ((row: T) => string);
  context?: Table<T>;
  showHeader?: boolean;
  showSummary?: boolean;
  sumText?: string;
  summaryMethod?: SummaryMethod<T>;
  rowClassName?: ColumnCls<T>;
  rowStyle?: ColumnStyle<T>;
  cellClassName?: CellCls<T>;
  cellStyle?: CellStyle<T>;
  headerRowClassName?: ColumnCls<T>;
  headerRowStyle?: ColumnStyle<T>;
  headerCellClassName?: CellCls<T>;
  headerCellStyle?: CellStyle<T>;
  highlightCurrentRow?: boolean;
  currentRowKey?: string | number;
  emptyText?: string;
  expandRowKeys?: any[];
  defaultExpandAll?: boolean;
  defaultSort?: Sort;
  tooltipEffect?: string;
  spanMethod?: (data: {
    row: T;
    rowIndex: number;
    column: TableColumnCtx<T>;
    columnIndex: number;
  }) =>
  | number[]
  | {
    rowspan: number;
    colspan: number;
  }
  | undefined;
  selectOnIndeterminate?: boolean;
  indent?: number;
  treeProps?: {
    hasChildren?: string;
    children?: string;
  };
  lazy?: boolean;
  load?: (row: T, treeNode: TreeNode, resolve: (data: T[]) => void) => void;
  className?: string;
  style?: CSSProperties;
  tableLayout: Layout;
  flexible: boolean;
}

export interface Sort {
  prop: string;
  order: 'ascending' | 'descending';
  init?: any;
  silent?: any;
}

export interface Filter<T> {
  column: TableColumnCtx<T>;
  values: string[];
  silent: any;
}

export interface TreeNode {
  expanded?: boolean;
  loading?: boolean;
  noLazyChildren?: boolean;
  indent?: number;
  level?: number;
  display?: boolean;
}

export interface RenderRowData<T> {
  store: Store<T>;
  _self: Table<T>;
  column: TableColumnCtx<T>;
  row: T;
  $index: number;
  treeNode?: TreeNode;
  expanded: boolean;
}

export const tableProps = {
  data: {
    type: Array as PropType<DefaultRow[]>,
    default: () => [],
  },
  size: String,
  width: [String, Number],
  height: [String, Number],
  maxHeight: [String, Number],
  fit: {
    type: Boolean,
    default: true,
  },
  stripe: Boolean,
  border: Boolean,
  rowKey: [String, Function] as PropType<TableProps<DefaultRow>['rowKey']>,
  showHeader: {
    type: Boolean,
    default: true,
  },
  showSummary: Boolean,
  sumText: String,
  summaryMethod: Function as PropType<TableProps<DefaultRow>['summaryMethod']>,
  rowClassName: [String, Function] as PropType<TableProps<DefaultRow>['rowClassName']>,
  rowStyle: [Object, Function] as PropType<TableProps<DefaultRow>['rowStyle']>,
  cellClassName: [String, Function] as PropType<TableProps<DefaultRow>['cellClassName']>,
  cellStyle: [Object, Function] as PropType<TableProps<DefaultRow>['cellStyle']>,
  headerRowClassName: [String, Function] as PropType<TableProps<DefaultRow>['headerRowClassName']>,
  headerRowStyle: [Object, Function] as PropType<
  TableProps<DefaultRow>['headerRowStyle']
  >,
  headerCellClassName: [String, Function] as PropType<
  TableProps<DefaultRow>['headerCellClassName']
  >,
  headerCellStyle: [Object, Function] as PropType<
  TableProps<DefaultRow>['headerCellStyle']
  >,
  highlightCurrentRow: Boolean,
  currentRowKey: [String, Number],
  emptyText: String,
  expandRowKeys: Array as PropType<TableProps<DefaultRow>['expandRowKeys']>,
  defaultExpandAll: Boolean,
  defaultSort: Object as PropType<TableProps<DefaultRow>['defaultSort']>,
  tooltipEffect: String,
  spanMethod: Function as PropType<TableProps<DefaultRow>['spanMethod']>,
  selectOnIndeterminate: {
    type: Boolean,
    default: true,
  },
  indent: {
    type: Number,
    default: 16,
  },
  treeProps: {
    type: Object as PropType<TableProps<DefaultRow>['treeProps']>,
    default: () => {
      return {
        hasChildren: 'hasChildren',
        children: 'children',
      };
    },
  },
  lazy: Boolean,
  load: Function as PropType<TableProps<DefaultRow>['load']>,
  style: {
    type: Object as PropType<CSSProperties>,
    default: () => ({}),
  },
  className: {
    type: String,
    default: '',
  },
  tableLayout: {
    type: String as PropType<Layout>,
    default: 'fixed',
  },
  scrollbarAlwaysOn: {
    type: Boolean,
    default: false,
  },
  flexible: Boolean,
};

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

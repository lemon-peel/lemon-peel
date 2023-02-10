import { withInstall, withNoopInstall } from '@lemon-peel/utils';

import Table from './src/table/Table.vue';
import TableColumn from './src/tableColumn';

export const LpTable = withInstall(Table, { TableColumn });

export default LpTable;

export const LpTableColumn = withNoopInstall(TableColumn);

export type TableInstance = InstanceType<typeof Table>;

export type TableColumnInstance = InstanceType<typeof TableColumn>;

export type {
  SummaryMethod,
  TableProps,
  TableRefs,
  ColumnCls,
  ColumnStyle,
  TreeNode,
  RenderRowData,
  Sort,
  Filter,
} from './src/table/defaults';

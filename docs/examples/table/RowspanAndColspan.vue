<template>
  <div>
    <lp-table
      :data="tableData"
      :span-method="arraySpanMethod"
      border
      style="width: 100%"
    >
      <lp-table-column prop="id" label="ID" width="180" />
      <lp-table-column prop="name" label="Name" />
      <lp-table-column prop="amount1" sortable label="Amount 1" />
      <lp-table-column prop="amount2" sortable label="Amount 2" />
      <lp-table-column prop="amount3" sortable label="Amount 3" />
    </lp-table>

    <lp-table
      :data="tableData"
      :span-method="objectSpanMethod"
      border
      style="width: 100%; margin-top: 20px"
    >
      <lp-table-column prop="id" label="ID" width="180" />
      <lp-table-column prop="name" label="Name" />
      <lp-table-column prop="amount1" label="Amount 1" />
      <lp-table-column prop="amount2" label="Amount 2" />
      <lp-table-column prop="amount3" label="Amount 3" />
    </lp-table>
  </div>
</template>

<script lang="ts" setup>
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults';

interface User {
  id: string;
  name: string;
  amount1: string;
  amount2: string;
  amount3: number;
}

interface SpanMethodProps {
  row: User;
  column: TableColumnCtx<User>;
  rowIndex: number;
  columnIndex: number;
}

const arraySpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}: SpanMethodProps) => {
  if (rowIndex % 2 === 0) {
    if (columnIndex === 0) {
      return [1, 2];
    } else if (columnIndex === 1) {
      return [0, 0];
    }
  }
};

const objectSpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}: SpanMethodProps) => {
  if (columnIndex === 0) {
    return rowIndex % 2 === 0 ? {
      rowspan: 2,
      colspan: 1,
    } : {
      rowspan: 0,
      colspan: 0,
    };
  }
};

const tableData: User[] = [
  {
    id: '12987122',
    name: 'Tom',
    amount1: '234',
    amount2: '3.2',
    amount3: 10,
  },
  {
    id: '12987123',
    name: 'Tom',
    amount1: '165',
    amount2: '4.43',
    amount3: 12,
  },
  {
    id: '12987124',
    name: 'Tom',
    amount1: '324',
    amount2: '1.9',
    amount3: 9,
  },
  {
    id: '12987125',
    name: 'Tom',
    amount1: '621',
    amount2: '2.2',
    amount3: 17,
  },
  {
    id: '12987126',
    name: 'Tom',
    amount1: '539',
    amount2: '4.1',
    amount3: 15,
  },
];
</script>

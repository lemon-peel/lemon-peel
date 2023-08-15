<template>
  <lp-table :data="tableData" border show-summary style="width: 100%">
    <lp-table-column prop="id" label="ID" width="180" />
    <lp-table-column prop="name" label="Name" />
    <lp-table-column prop="amount1" sortable label="Amount 1" />
    <lp-table-column prop="amount2" sortable label="Amount 2" />
    <lp-table-column prop="amount3" sortable label="Amount 3" />
  </lp-table>

  <lp-table
    :data="tableData"
    border
    height="200"
    :summary-method="getSummaries"
    show-summary
    style="width: 100%; margin-top: 20px"
  >
    <lp-table-column prop="id" label="ID" width="180" />
    <lp-table-column prop="name" label="Name" />
    <lp-table-column prop="amount1" label="Cost 1 ($)" />
    <lp-table-column prop="amount2" label="Cost 2 ($)" />
    <lp-table-column prop="amount3" label="Cost 3 ($)" />
  </lp-table>
</template>

<script lang="ts" setup>
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults';

interface Product {
  id: string;
  name: string;
  amount1: string;
  amount2: string;
  amount3: number;
}

interface SummaryMethodProps<T = Product> {
  columns: TableColumnCtx<T>[];
  data: T[];
}

const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param;
  const sums: string[] = [];
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = 'Total Cost';
      return;
    }
    const values = data.map(item => Number(item[column.property]));
    sums[index] = values.every(value => Number.isNaN(value)) ? 'N/A' : `$ ${values.reduce((prev, curr) => {
      const value = Number(curr);
      return Number.isNaN(value) ? prev : prev + curr;
    }, 0)}`;
  });

  return sums;
};

const tableData: Product[] = [
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

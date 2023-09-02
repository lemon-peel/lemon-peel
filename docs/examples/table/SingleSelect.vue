<template>
  <lp-table
    ref="singleTableRef"
    :data="tableData"
    highlight-current-row
    style="width: 100%"
    @current-change="handleCurrentChange"
  >
    <lp-table-column type="index" width="50" />
    <lp-table-column property="date" label="Date" width="120" />
    <lp-table-column property="name" label="Name" width="120" />
    <lp-table-column property="address" label="Address" />
  </lp-table>
  <div style="margin-top: 20px">
    <lp-button @click="setCurrent(tableData[1])">Select second row</lp-button>
    <lp-button @click="setCurrent()">Clear selection</lp-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { LpTable } from 'lemon-peel';

interface User {
  date: string;
  name: string;
  address: string;
}

const currentRow = ref();
const singleTableRef = ref<InstanceType<typeof LpTable>>();

const setCurrent = (row?: User) => {
  singleTableRef.value!.setCurrentRow(row);
};
const handleCurrentChange = (val: User | undefined) => {
  currentRow.value = val;
};
const tableData: User[] = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
];
</script>

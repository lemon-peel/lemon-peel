<template>
  <lp-table :data="tableData" style="width: 100%">
    <lp-table-column label="Date" width="180">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <lp-icon><timer /></lp-icon>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </div>
      </template>
    </lp-table-column>
    <lp-table-column label="Name" width="180">
      <template #default="scope">
        <lp-popover effect="light" trigger="hover" placement="top" width="auto">
          <template #default>
            <div>name: {{ scope.row.name }}</div>
            <div>address: {{ scope.row.address }}</div>
          </template>
          <template #reference>
            <lp-tag>{{ scope.row.name }}</lp-tag>
          </template>
        </lp-popover>
      </template>
    </lp-table-column>
    <lp-table-column label="Operations">
      <template #default="scope">
        <lp-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</lp-button>
        <lp-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
        >Delete</lp-button>
      </template>
    </lp-table-column>
  </lp-table>
</template>

<script lang="ts" setup>
import { Timer } from '@element-plus/icons-vue';

interface User {
  date: string;
  name: string;
  address: string;
}

const handleEdit = (index: number, row: User) => {
  console.log(index, row);
};
const handleDelete = (index: number, row: User) => {
  console.log(index, row);
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

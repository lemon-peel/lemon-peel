<template>
  <lp-radio-group v-model="tableLayout">
    <lp-radio-button label="fixed" />
    <lp-radio-button label="auto" />
  </lp-radio-group>
  <lp-table :data="tableData" :table-layout="tableLayout">
    <lp-table-column prop="date" label="Date" />
    <lp-table-column prop="name" label="Name" />
    <lp-table-column prop="address" label="Address" />
  </lp-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const tableLayout = ref('fixed');

const tableData = [
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

<template>
  <lp-table v-loading="loading" :data="tableData" style="width: 100%">
    <lp-table-column prop="date" label="Date" width="180" />
    <lp-table-column prop="name" label="Name" width="180" />
    <lp-table-column prop="address" label="Address" />
  </lp-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const loading = ref(true);

const tableData = [
  {
    date: '2016-05-02',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
  {
    date: '2016-05-04',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
  {
    date: '2016-05-01',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
];
</script>

<style>
body {
  margin: 0;
}
</style>

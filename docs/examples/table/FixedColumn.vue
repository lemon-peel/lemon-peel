<template>
  <lp-table :data="tableData" style="width: 100%">
    <lp-table-column fixed prop="date" label="Date" width="150" />
    <lp-table-column prop="name" label="Name" width="120" />
    <lp-table-column prop="state" label="State" width="120" />
    <lp-table-column prop="city" label="City" width="120" />
    <lp-table-column prop="address" label="Address" width="600" />
    <lp-table-column prop="zip" label="Zip" width="120" />
    <lp-table-column fixed="right" label="Operations" width="120">
      <template #default>
        <lp-button link type="primary" size="small" @click="handleClick">Detail</lp-button>
        <lp-button link type="primary" size="small">Edit</lp-button>
      </template>
    </lp-table-column>
  </lp-table>
</template>

<script lang="ts" setup>
const handleClick = () => {
  console.log('click');
};

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Home',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Office',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Home',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Office',
  },
];
</script>

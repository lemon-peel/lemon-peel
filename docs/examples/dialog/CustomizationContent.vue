<template>
  <lp-button text @click="dialogTableVisible = true">
    open a Table nested Dialog
  </lp-button>

  <lp-dialog v-model="dialogTableVisible" title="Shipping address">
    <lp-table :data="gridData">
      <lp-table-column property="date" label="Date" width="150" />
      <lp-table-column property="name" label="Name" width="200" />
      <lp-table-column property="address" label="Address" />
    </lp-table>
  </lp-dialog>

  <!-- Form -->
  <lp-button text @click="dialogFormVisible = true">
    open a Form nested Dialog
  </lp-button>

  <lp-dialog v-model="dialogFormVisible" title="Shipping address">
    <lp-form :model="form">
      <lp-form-item label="Promotion name" :label-width="formLabelWidth">
        <lp-input v-model="form.name" autocomplete="off" />
      </lp-form-item>
      <lp-form-item label="Zones" :label-width="formLabelWidth">
        <lp-select v-model="form.region" placeholder="Please select a zone">
          <lp-option label="Zone No.1" value="shanghai" />
          <lp-option label="Zone No.2" value="beijing" />
        </lp-select>
      </lp-form-item>
    </lp-form>
    <template #footer>
      <span class="dialog-footer">
        <lp-button @click="dialogFormVisible = false">Cancel</lp-button>
        <lp-button type="primary" @click="dialogFormVisible = false">
          Confirm
        </lp-button>
      </span>
    </template>
  </lp-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

const dialogTableVisible = ref(false);
const dialogFormVisible = ref(false);
const formLabelWidth = '140px';

const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
});

const gridData = [
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
  {
    date: '2016-05-03',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
];
</script>
<style scoped>
.lp-button--text {
  margin-right: 15px;
}
.lp-select {
  width: 300px;
}
.lp-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>

<template>
  <lp-button text @click="table = true">Open Drawer with nested table</lp-button>
  <lp-button text @click="dialog = true">Open Drawer with nested form</lp-button>
  <lp-drawer
    v-model="table"
    title="I have a nested table inside!"
    direction="rtl"
    size="50%"
  >
    <lp-table :data="gridData">
      <lp-table-column property="date" label="Date" width="150" />
      <lp-table-column property="name" label="Name" width="200" />
      <lp-table-column property="address" label="Address" />
    </lp-table>
  </lp-drawer>

  <lp-drawer
    ref="drawerRef"
    v-model="dialog"
    title="I have a nested form inside!"
    :before-close="handleClose"
    direction="ltr"
    custom-class="demo-drawer"
  >
    <div class="demo-drawer__content">
      <lp-form :model="form">
        <lp-form-item label="Name" :label-width="formLabelWidth">
          <lp-input v-model:value="form.name" autocomplete="off" />
        </lp-form-item>
        <lp-form-item label="Area" :label-width="formLabelWidth">
          <lp-select
            v-model:value="form.region"
            placeholder="Please select activity area"
          >
            <lp-option label="Area1" value="shanghai" />
            <lp-option label="Area2" value="beijing" />
          </lp-select>
        </lp-form-item>
      </lp-form>
      <div class="demo-drawer__footer">
        <lp-button @click="cancelForm">Cancel</lp-button>
        <lp-button type="primary" :loading="loading" @click="onClick">{{
          loading ? 'Submitting ...' : 'Submit'
        }}</lp-button>
      </div>
    </div>
  </lp-drawer>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LpDrawer } from 'lemon-peel';
import { LpMessageBox } from 'lemon-peel';

const formLabelWidth = '80px';
let timer: number;

const table = ref(false);
const dialog = ref(false);
const loading = ref(false);

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
    name: 'Peter Parker',
    address: 'Queens, New York City',
  },
  {
    date: '2016-05-04',
    name: 'Peter Parker',
    address: 'Queens, New York City',
  },
  {
    date: '2016-05-01',
    name: 'Peter Parker',
    address: 'Queens, New York City',
  },
  {
    date: '2016-05-03',
    name: 'Peter Parker',
    address: 'Queens, New York City',
  },
];

const drawerRef = ref<InstanceType<typeof LpDrawer>>();
const onClick = () => {
  drawerRef.value!.close();
};

const handleClose = done => {
  if (loading.value) {
    return;
  }
  LpMessageBox.confirm('Do you want to submit?')
    .then(() => {
      loading.value = true;
      timer = setTimeout(() => {
        done();
        // 动画关闭需要一定的时间
        setTimeout(() => {
          loading.value = false;
        }, 400);
      }, 2000);
    })
    .catch(() => {
      // catch error
    });
};

const cancelForm = () => {
  loading.value = false;
  dialog.value = false;
  clearTimeout(timer);
};
</script>

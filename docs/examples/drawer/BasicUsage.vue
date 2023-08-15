<template>
  <lp-radio-group v-model="direction">
    <lp-radio label="ltr">left to right</lp-radio>
    <lp-radio label="rtl">right to left</lp-radio>
    <lp-radio label="ttb">top to bottom</lp-radio>
    <lp-radio label="btt">bottom to top</lp-radio>
  </lp-radio-group>

  <lp-button type="primary" style="margin-left: 16px" @click="drawer = true">
    open
  </lp-button>
  <lp-button type="primary" style="margin-left: 16px" @click="drawer2 = true">
    with footer
  </lp-button>

  <lp-drawer
    v-model="drawer"
    title="I am the title"
    :direction="direction"
    :before-close="handleClose"
  >
    <span>Hi, there!</span>
  </lp-drawer>
  <lp-drawer v-model="drawer2" :direction="direction">
    <template #title>
      <h4>set title by slot</h4>
    </template>
    <template #default>
      <div>
        <lp-radio v-model="radio1" label="Option 1" size="large">Option 1</lp-radio>
        <lp-radio v-model="radio1" label="Option 2" size="large">Option 2</lp-radio>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <lp-button @click="cancelClick">cancel</lp-button>
        <lp-button type="primary" @click="confirmClick">confirm</lp-button>
      </div>
    </template>
  </lp-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessageBox } from 'element-plus';

const drawer = ref(false);
const drawer2 = ref(false);
const direction = ref('rtl');
const radio1 = ref('Option 1');
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure you want to close this?')
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
function cancelClick() {
  drawer2.value = false;
}
function confirmClick() {
  ElMessageBox.confirm(`Are you confirm to chose ${radio1.value} ?`)
    .then(() => {
      drawer2.value = false;
    })
    .catch(() => {
      // catch error
    });
}
</script>

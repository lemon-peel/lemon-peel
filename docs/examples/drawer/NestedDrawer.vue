<template>
  <lp-button type="primary" style="margin-left: 16px" @click="drawer = true">
    open
  </lp-button>

  <lp-drawer v-model="drawer" title="I'm outer Drawer" size="50%">
    <div>
      <lp-button @click="innerDrawer = true">Click me!</lp-button>
      <lp-drawer
        v-model="innerDrawer"
        title="I'm inner Drawer"
        :append-to-body="true"
        :before-close="handleClose"
      >
        <p>_(:зゝ∠)_</p>
      </lp-drawer>
    </div>
  </lp-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessageBox } from 'element-plus';

const drawer = ref(false);
const innerDrawer = ref(false);

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('You still have unsaved data, proceed?')
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
</script>

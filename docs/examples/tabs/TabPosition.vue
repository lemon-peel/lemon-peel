<template>
  <lp-radio-group v-model:value="tabPosition" style="margin-bottom: 30px">
    <lp-radio-button label="top">top</lp-radio-button>
    <lp-radio-button label="right">right</lp-radio-button>
    <lp-radio-button label="bottom">bottom</lp-radio-button>
    <lp-radio-button label="left">left</lp-radio-button>
  </lp-radio-group>

  <lp-tabs :tab-position="tabPosition" style="height: 200px" class="demo-tabs">
    <lp-tab-pane label="User">User</lp-tab-pane>
    <lp-tab-pane label="Config">Config</lp-tab-pane>
    <lp-tab-pane label="Role">Role</lp-tab-pane>
    <lp-tab-pane label="Task">Task</lp-tab-pane>
  </lp-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const tabPosition = ref('left');
</script>
<style>
.demo-tabs > .lp-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.lp-tabs--right .lp-tabs__content,
.lp-tabs--left .lp-tabs__content {
  height: 100%;
}
</style>

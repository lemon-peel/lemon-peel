<template>
  <lp-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <lp-tab-pane label="User" name="first">User</lp-tab-pane>
    <lp-tab-pane label="Config" name="second">Config</lp-tab-pane>
    <lp-tab-pane label="Role" name="third">Role</lp-tab-pane>
    <lp-tab-pane label="Task" name="fourth">Task</lp-tab-pane>
  </lp-tabs>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const activeName = ref('first');

const handleClick = (tab: string, event: Event) => {
  console.log(tab, event);
};
</script>
<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>

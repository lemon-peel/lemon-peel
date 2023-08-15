<template>
  <lp-tabs type="border-card" class="demo-tabs">
    <lp-tab-pane>
      <template #label>
        <span class="custom-tabs-label">
          <lp-icon><calendar /></lp-icon>
          <span>Route</span>
        </span>
      </template>
      Route
    </lp-tab-pane>
    <lp-tab-pane label="Config">Config</lp-tab-pane>
    <lp-tab-pane label="Role">Role</lp-tab-pane>
    <lp-tab-pane label="Task">Task</lp-tab-pane>
  </lp-tabs>
</template>

<script lang="ts" setup>
import { Calendar } from '@element-plus/icons-vue';
</script>
<style>
.demo-tabs > .lp-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.demo-tabs .custom-tabs-label .lp-icon {
  vertical-align: middle;
}
.demo-tabs .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
</style>

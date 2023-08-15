<template>
  <div class="demo-progress">
    <lp-progress :percentage="50">
      <lp-button text>Content</lp-button>
    </lp-progress>
    <lp-progress
      :text-inside="true"
      :stroke-width="20"
      :percentage="50"
      status="exception"
    >
      <span>Content</span>
    </lp-progress>
    <lp-progress type="circle" :percentage="100" status="success">
      <lp-button type="success" :icon="Check" circle />
    </lp-progress>
    <lp-progress type="dashboard" :percentage="80">
      <template #default="{ percentage }">
        <span class="percentage-value">{{ percentage }}%</span>
        <span class="percentage-label">Progressing</span>
      </template>
    </lp-progress>
  </div>
</template>

<script lang="ts" setup>
import { Check } from '@element-plus/icons-vue';
</script>

<style scoped>
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}
.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}
.demo-progress .lp-progress--line {
  margin-bottom: 15px;
  width: 350px;
}
.demo-progress .lp-progress--circle {
  margin-right: 15px;
}
</style>

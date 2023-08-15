<template>
  <lp-tooltip-v2 full-transition :transition-props="transitionProps">
    <template #trigger>
      <lp-button circle><lp-icon><Plus /></lp-icon></lp-button>
    </template>
    <div>content</div>
  </lp-tooltip-v2>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue';

const transitionProps = {
  name: 'el-fade-in-linear',
};
</script>

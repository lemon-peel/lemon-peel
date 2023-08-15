<template>
  <lp-tooltip-v2 aria-label="content" show-arrow always-on placement="top">
    <template #trigger>
      <lp-button circle><lp-icon><Plus /></lp-icon></lp-button>
    </template>
    Basic tooltip
  </lp-tooltip-v2>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue';
</script>

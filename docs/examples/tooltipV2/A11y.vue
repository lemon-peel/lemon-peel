<template>
  <lp-tooltip-v2 :aria-label="title">
    <template #trigger>
      <lp-button><lp-icon><Delete /></lp-icon></lp-button>
    </template>
    {{ content }}
  </lp-tooltip-v2>
</template>

<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue';
const content = 'Delete';
const title = 'Delete item';
</script>

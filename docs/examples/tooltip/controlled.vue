<template>
  <lp-tooltip :visible="visible">
    <template #content>
      <span>Content</span>
    </template>
    <lp-button @mouseenter="visible = true" @mouseleave="visible = false">
      Hover me
    </lp-button>
  </lp-tooltip>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false);
</script>

<template>
  <lp-space :size="size" :spacer="spacer">
    <div v-for="i in 2" :key="i">
      <lp-button> button {{ i }} </lp-button>
    </div>
  </lp-space>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { ElDivider } from 'element-plus';

const size = ref(10);
const spacer = h(ElDivider, { direction: 'vertical' });
</script>

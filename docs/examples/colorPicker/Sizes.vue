<template>
  <div class="demo-color-sizes">
    <lp-color-picker v-model:value="color" size="large" />
    <lp-color-picker v-model:value="color" />
    <lp-color-picker v-model:value="color" size="small" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const color = ref('409EFF');
</script>

<style>
.demo-color-sizes .lp-color-picker:not(:last-child) {
  margin-right: 16px;
}
</style>

<template>
  <div class="demo-color-sizes">
    <lp-color-picker v-model="color" size="large" />
    <lp-color-picker v-model="color" />
    <lp-color-picker v-model="color" size="small" />
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

<template>
  <div class="mb-2 flex items-center text-sm">
    <lp-radio-group v-model:value="radio1" class="ml-4">
      <lp-radio label="1" size="large">Option 1</lp-radio>
      <lp-radio label="2" size="large">Option 2</lp-radio>
    </lp-radio-group>
  </div>
  <div class="my-2 flex items-center text-sm">
    <lp-radio-group v-model:value="radio2" class="ml-4">
      <lp-radio label="1">Option 1</lp-radio>
      <lp-radio label="2">Option 2</lp-radio>
    </lp-radio-group>
  </div>
  <div class="my-4 flex items-center text-sm">
    <lp-radio-group v-model:value="radio3" class="ml-4">
      <lp-radio label="1" size="small">Option 1</lp-radio>
      <lp-radio label="2" size="small">Option 2</lp-radio>
    </lp-radio-group>
  </div>
  <div class="mb-2 flex items-center text-sm">
    <lp-radio-group v-model:value="radio3" disabled class="ml-4">
      <lp-radio label="1" size="small">Option 1</lp-radio>
      <lp-radio label="2" size="small">Option 2</lp-radio>
    </lp-radio-group>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const radio1 = ref('1');
const radio2 = ref('1');
const radio3 = ref('1');
</script>

<template>
  <div>
    <lp-radio v-model:checked="radio1" label="1" size="large">Option 1</lp-radio>
    <lp-radio v-model:checked="radio1" label="2" size="large">Option 2</lp-radio>
  </div>
  <div>
    <lp-radio v-model:checked="radio2" label="1">Option 1</lp-radio>
    <lp-radio v-model:checked="radio2" label="2">Option 2</lp-radio>
  </div>
  <div>
    <lp-radio v-model:checked="radio3" label="1" size="small">Option 1</lp-radio>
    <lp-radio v-model:checked="radio3" label="2" size="small">Option 2</lp-radio>
  </div>
  <div>
    <lp-radio v-model:checked="radio3" label="1" size="small" disabled>Option 1</lp-radio>
    <lp-radio v-model:checked="radio3" label="2" size="small" disabled>Option 2</lp-radio>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const radio1 = ref('1');
const radio2 = ref('1');
const radio3 = ref('1');
</script>

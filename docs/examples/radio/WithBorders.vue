<template>
  <div>
    <lp-radio-group v-model="radio1">
      <lp-radio label="1" size="large" border>Option A</lp-radio>
      <lp-radio label="2" size="large" border>Option B</lp-radio>
    </lp-radio-group>
  </div>
  <div style="margin-top: 20px">
    <lp-radio-group v-model="radio2">
      <lp-radio label="1" border>Option A</lp-radio>
      <lp-radio label="2" border>Option B</lp-radio>
    </lp-radio-group>
  </div>
  <div style="margin-top: 20px">
    <lp-radio-group v-model="radio3" size="small">
      <lp-radio label="1" border>Option A</lp-radio>
      <lp-radio label="2" border disabled>Option B</lp-radio>
    </lp-radio-group>
  </div>
  <div style="margin-top: 20px">
    <lp-radio-group v-model="radio4" size="small" disabled>
      <lp-radio label="1" border>Option A</lp-radio>
      <lp-radio label="2" border>Option B</lp-radio>
    </lp-radio-group>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const radio1 = ref('1');
const radio2 = ref('1');
const radio3 = ref('1');
const radio4 = ref('1');
</script>

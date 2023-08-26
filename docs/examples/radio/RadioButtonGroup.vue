<template>
  <lp-radio-group v-model:value="radio">
    <lp-radio :label="3">Option A</lp-radio>
    <lp-radio :label="6">Option B</lp-radio>
    <lp-radio :label="9">Option C</lp-radio>
  </lp-radio-group>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const radio = ref(3);
</script>

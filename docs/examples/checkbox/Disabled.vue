<template>
  <lp-checkbox v-model:checked="checked1" disabled>Disabled</lp-checkbox>
  <lp-checkbox v-model:checked="checked2">Not disabled</lp-checkbox>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const checked1 = ref(false);
const checked2 = ref(true);
</script>

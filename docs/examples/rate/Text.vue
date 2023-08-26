<template>
  <lp-rate
    v-model:value="value"
    :texts="['oops', 'disappointed', 'normal', 'good', 'great']"
    show-text
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const value = ref();
</script>

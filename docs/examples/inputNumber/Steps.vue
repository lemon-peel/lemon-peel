<template>
  <lp-input-number v-model:value="num" :step="2" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const num = ref(5);
</script>

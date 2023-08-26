<template>
  <lp-rate v-model:value="value" clearable />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const value = ref(3);
</script>

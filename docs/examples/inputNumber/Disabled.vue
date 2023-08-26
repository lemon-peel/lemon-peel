<template>
  <lp-input-number v-model:value="num" :disabled="true" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const num = ref(1);
</script>

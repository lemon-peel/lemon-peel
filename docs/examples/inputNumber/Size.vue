<template>
  <lp-input-number v-model:value="num1" size="large" />
  <lp-input-number v-model:value="num2" class="mx-4" />
  <lp-input-number v-model:value="num3" size="small" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const num1 = ref(1);
const num2 = ref(2);
const num3 = ref(3);
</script>

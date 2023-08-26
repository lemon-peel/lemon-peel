<template>
  <lp-switch v-model:value="value1" loading />
  <lp-switch v-model:value="value2" loading class="ml-2" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const value1 = ref(true);
const value2 = ref(false);
</script>

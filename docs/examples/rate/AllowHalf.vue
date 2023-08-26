<template>
  <lp-rate v-model:value="value" allow-half />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const value = ref();
</script>

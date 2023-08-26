<template>
  <lp-input-number v-model:value="num" :min="1" :max="10" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const num = ref(1);
</script>

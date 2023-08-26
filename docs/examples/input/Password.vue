<template>
  <lp-input
    v-model:value="input"
    type="password"
    placeholder="Please input password"
    show-password
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const input = ref('');
</script>

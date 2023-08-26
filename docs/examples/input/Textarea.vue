<template>
  <lp-input
    v-model:value="textarea"
    :rows="2"
    type="textarea"
    placeholder="Please input"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const textarea = ref('');
</script>

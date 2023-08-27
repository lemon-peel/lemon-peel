<template>
  <lp-input
    v-model:value="text"
    maxlength="10"
    placeholder="Please input"
    show-word-limit
    type="text"
  />
  <div style="margin: 20px 0" />
  <lp-input
    v-model:value="textarea"
    maxlength="30"
    placeholder="Please input"
    show-word-limit
    type="textarea"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const text = ref('');
const textarea = ref('');
</script>

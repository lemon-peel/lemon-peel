<template>
  <lp-switch
    v-model:value="value"
    size="large"
    active-text="Open"
    inactive-text="Close"
  />
  <br>
  <lp-switch v-model:value="value" active-text="Open" inactive-text="Close" />
  <br>
  <lp-switch
    v-model:value="value"
    size="small"
    active-text="Open"
    inactive-text="Close"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const value = ref(true);
</script>

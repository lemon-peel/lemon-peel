<template>
  <lp-steps :active="active" finish-status="success">
    <lp-step title="Step 1" />
    <lp-step title="Step 2" />
    <lp-step title="Step 3" />
  </lp-steps>

  <lp-button style="margin-top: 12px" @click="next">Next step</lp-button>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const active = ref(0);

const next = () => {
  if (active.value++ > 2) active.value = 0;
};
</script>

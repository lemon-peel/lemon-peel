<template>
  <lp-space :size="size" spacer="|">
    <div v-for="i in 2" :key="i">
      <lp-button> button {{ i }} </lp-button>
    </div>
  </lp-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const size = ref(10);
</script>

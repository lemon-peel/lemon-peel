<template>
  <div class="example-basic">
    <lp-time-picker v-model:value="value1" placeholder="Arbitrary time" />
    <lp-time-picker
      v-model:value="value2"
      arrow-control
      placeholder="Arbitrary time"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const value1 = ref();
const value2 = ref();
</script>

<style>
.example-basic .lp-date-editor {
  margin: 8px;
}
</style>

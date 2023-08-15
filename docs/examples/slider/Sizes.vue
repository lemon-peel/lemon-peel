<template>
  <lp-slider v-model="value" show-input size="large" />
  <lp-slider v-model="value" show-input />
  <lp-slider v-model="value" show-input size="small" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const value = ref(0);
</script>

<style scoped>
.lp-slider {
  margin-top: 20px;
}

.lp-slider:first-child {
  margin-top: 0;
}
</style>
<style scoped>
.slider-demo-block {
  display: flex;
  align-items: center;
}
.slider-demo-block .lp-slider {
  margin-top: 0;
  margin-left: 12px;
}
</style>

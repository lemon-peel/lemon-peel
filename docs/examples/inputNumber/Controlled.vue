<template>
  <lp-input-number
    v-model:value="num"
    :min="1"
    :max="10"
    controls-position="right"
    size="large"
    @change="handleChange"
  />
  <lp-input-number
    v-model:value="num"
    class="mx-4"
    :min="1"
    :max="10"
    controls-position="right"
    @change="handleChange"
  />
  <lp-input-number
    v-model:value="num"
    :min="1"
    :max="10"
    size="small"
    controls-position="right"
    @change="handleChange"
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const num = ref(1);
const handleChange = (value: number) => {
  console.log(value);
};
</script>

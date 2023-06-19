<template>
  <div class="fake-input">
    <input v-model="value" type="text" @focus="onFocus" @blur="onBlur">
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const value = ref('');
const onFocus = () => {
  console.info('onFocus');
};
const onBlur = () => {
  console.info('onBlur');
};
</script>
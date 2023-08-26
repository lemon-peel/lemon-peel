<template>
  <lp-switch
    v-model:value="value1"
    :loading="loading1"
    :before-change="beforeChange1"
  />
  <lp-switch
    v-model:value="value2"
    class="ml-2"
    :loading="loading2"
    :before-change="beforeChange2"
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { LpMessage } from 'lemon-peel';

const value1 = ref(false);
const value2 = ref(false);
const loading1 = ref(false);
const loading2 = ref(false);

const beforeChange1 = () => {
  loading1.value = true;
  return new Promise(resolve => {
    setTimeout(() => {
      loading1.value = false;
      LpMessage.success('Switch success');
      return resolve(true);
    }, 1000);
  });
};

const beforeChange2 = () => {
  loading2.value = true;
  return new Promise((_, reject) => {
    setTimeout(() => {
      loading2.value = false;
      LpMessage.error('Switch failed');
      return reject(new Error('Error'));
    }, 1000);
  });
};
</script>

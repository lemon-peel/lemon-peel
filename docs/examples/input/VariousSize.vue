<template>
  <div class="demo-input-size">
    <lp-input
      v-model:value="input1"
      class="w-50 m-2"
      size="large"
      placeholder="Please Input"
    />
    <lp-input v-model:value="value=&quot;input2&quot;" class="w-50 m-2" placeholder="Please Input" />
    <lp-input
      v-model:value="input3"
      class="w-50 m-2"
      size="small"
      placeholder="Please Input"
    />
  </div>
  <div class="demo-input-size">
    <lp-input
      v-model:value="input1"
      class="w-50 m-2"
      size="large"
      placeholder="Please Input"
      :suffix-icon="Search"
    />
    <lp-input
      v-model:value="input2"
      class="w-50 m-2"
      placeholder="Please Input"
      :suffix-icon="Search"
    />
    <lp-input
      v-model:value="input3"
      class="w-50 m-2"
      size="small"
      placeholder="Please Input"
      :suffix-icon="Search"
    />
  </div>
  <div class="demo-input-size">
    <lp-input
      v-model:value="input1"
      class="w-50 m-2"
      size="large"
      placeholder="Please Input"
      :prefix-icon="Search"
    />
    <lp-input
      v-model:value="input2"
      class="w-50 m-2"
      placeholder="Please Input"
      :prefix-icon="Search"
    />
    <lp-input
      v-model:value="input3"
      class="w-50 m-2"
      size="small"
      placeholder="Please Input"
      :prefix-icon="Search"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
const input1 = ref('');
const input2 = ref('');
const input3 = ref('');
</script>

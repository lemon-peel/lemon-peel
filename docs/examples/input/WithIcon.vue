<template>
  <div class="demo-input-suffix">
    <lp-row :gutter="20">
      <span class="ml-3 w-35 text-gray-600 inline-flex items-center">Using attributes</span>
      <lp-input
        v-model="input1"
        class="w-50 m-2"
        placeholder="Pick a date"
        :suffix-icon="Calendar"
      />
      <lp-input
        v-model="input2"
        class="w-50 m-2"
        placeholder="Type something"
        :prefix-icon="Search"
      />
    </lp-row>
  </div>
  <div class="demo-input-suffix">
    <lp-row :gutter="20">
      <span class="ml-3 w-35 text-gray-600 inline-flex items-center">Using slots</span>
      <lp-input v-model="input3" class="w-50 m-2" placeholder="Pick a date">
        <template #suffix>
          <lp-icon class="el-input__icon"><calendar /></lp-icon>
        </template>
      </lp-input>
      <lp-input v-model="input4" class="w-50 m-2" placeholder="Type something">
        <template #prefix>
          <lp-icon class="el-input__icon"><search /></lp-icon>
        </template>
      </lp-input>
    </lp-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Calendar, Search } from '@element-plus/icons-vue';
const input1 = ref('');
const input2 = ref('');
const input3 = ref('');
const input4 = ref('');
</script>

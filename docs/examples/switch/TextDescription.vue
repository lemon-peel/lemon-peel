<template>
  <lp-switch
    v-model:value="value1"
    class="mb-2"
    active-text="Pay by month"
    inactive-text="Pay by year"
  />
  <br>
  <lp-switch
    v-model:value="value2"
    class="mb-2"
    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
    active-text="Pay by month"
    inactive-text="Pay by year"
  />
  <br>
  <lp-switch
    v-model:value="value3"
    inline-prompt
    active-text="是"
    inactive-text="否"
  />
  <lp-switch
    v-model:value="value4"
    class="ml-2"
    inline-prompt
    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
    active-text="Y"
    inactive-text="N"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const value1 = ref(true);
const value2 = ref(true);
const value3 = ref(true);
const value4 = ref(true);
</script>

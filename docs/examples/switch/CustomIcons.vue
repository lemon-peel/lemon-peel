<template>
  <lp-switch v-model:value="value1" :active-icon="Check" :inactive-icon="Close" />
  <br>
  <lp-switch
    v-model:value="value2"
    class="mt-2"
    style="margin-left: 24px"
    inline-prompt
    :active-icon="Check"
    :inactive-icon="Close"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Check, Close } from '@element-plus/icons-vue';
const value1 = ref(true);
const value2 = ref(true);
</script>

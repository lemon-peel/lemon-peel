<template>
  <div>
    <lp-config-provider :message="config">
      <lp-button @click="open">OPEN</lp-button>
    </lp-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
const config = reactive({
  max: 3,
});
const open = () => {
  ElMessage('This is a message.');
};
</script>

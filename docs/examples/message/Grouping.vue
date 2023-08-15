<template>
  <lp-button :plain="true" @click="open">Show message</lp-button>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';

const open = () => {
  ElMessage({
    message: 'this is a message.',
    grouping: true,
    type: 'success',
  });
};
</script>

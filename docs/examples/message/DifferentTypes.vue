<template>
  <lp-button :plain="true" @click="open2">success</lp-button>
  <lp-button :plain="true" @click="open3">warning</lp-button>
  <lp-button :plain="true" @click="open1">message</lp-button>
  <lp-button :plain="true" @click="open4">error</lp-button>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';

const open1 = () => {
  ElMessage('this is a message.');
};
const open2 = () => {
  ElMessage({
    message: 'Congrats, this is a success message.',
    type: 'success',
  });
};
const open3 = () => {
  ElMessage({
    message: 'Warning, this is a warning message.',
    type: 'warning',
  });
};
const open4 = () => {
  ElMessage.error('Oops, this is a error message.');
};
</script>

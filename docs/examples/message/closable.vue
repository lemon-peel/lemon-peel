<template>
  <lp-button :plain="true" @click="open1">message</lp-button>
  <lp-button :plain="true" @click="open2">success</lp-button>
  <lp-button :plain="true" @click="open3">warning</lp-button>
  <lp-button :plain="true" @click="open4">error</lp-button>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';

const open1 = () => {
  ElMessage({
    showClose: true,
    message: 'This is a message.',
  });
};
const open2 = () => {
  ElMessage({
    showClose: true,
    message: 'Congrats, this is a success message.',
    type: 'success',
  });
};
const open3 = () => {
  ElMessage({
    showClose: true,
    message: 'Warning, this is a warning message.',
    type: 'warning',
  });
};
const open4 = () => {
  ElMessage({
    showClose: true,
    message: 'Oops, this is a error message.',
    type: 'error',
  });
};
</script>

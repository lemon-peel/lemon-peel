<template>
  <lp-button plain @click="open"> Hide close button </lp-button>
</template>

<script lang="ts" setup>
import { ElNotification } from 'element-plus';

const open = () => {
  ElNotification.success({
    title: 'Info',
    message: 'This is a message without close button',
    showClose: false,
  });
};
</script>

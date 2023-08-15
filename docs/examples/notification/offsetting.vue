<template>
  <lp-button plain @click="open"> Notification with offset </lp-button>
</template>

<script lang="ts" setup>
import { ElNotification } from 'element-plus';

const open = () => {
  ElNotification.success({
    title: 'Success',
    message: 'This is a success message',
    offset: 100,
  });
};
</script>

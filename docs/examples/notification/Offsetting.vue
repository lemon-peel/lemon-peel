<template>
  <lp-button plain @click="open"> Notification with offset </lp-button>
</template>

<script lang="ts" setup>
import { LpNotification } from 'lemon-peel';

const open = () => {
  LpNotification.success({
    title: 'Success',
    message: 'This is a success message',
    offset: 100,
  });
};
</script>

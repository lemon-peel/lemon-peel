<template>
  <lp-button plain @click="open"> Hide close button </lp-button>
</template>

<script lang="ts" setup>
import { LpNotification } from 'lemon-peel';

const open = () => {
  LpNotification.success({
    title: 'Info',
    message: 'This is a message without close button',
    showClose: false,
  });
};
</script>

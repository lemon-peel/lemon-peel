<template>
  <lp-button text @click="open">Click to open Message Box</lp-button>
</template>

<script lang="ts" setup>
import { LpMessage, LpMessageBox } from 'lemon-peel';

const open = () => {
  LpMessageBox.prompt('Please input your e-mail', 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    inputPattern:
      /[\w!#$%&'*+/=?^`{|}~-]+(?:\.[\w!#$%&'*+/=?^`{|}~-]+)*@(?:\w(?:[\w-]*\w)?\.)+\w(?:[\w-]*\w)?/,
    inputErrorMessage: 'Invalid Email',
  })
    .then(({ value }) => {
      LpMessage({
        type: 'success',
        message: `Your email is:${value}`,
      });
    })
    .catch(() => {
      LpMessage({
        type: 'info',
        message: 'Input canceled',
      });
    });
};
</script>

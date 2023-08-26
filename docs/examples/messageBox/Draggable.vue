<template>
  <lp-button text @click="open">Click to open Message Box</lp-button>
</template>

<script lang="ts" setup>
import { LpMessage, LpMessageBox } from 'lemon-peel';

const open = () => {
  LpMessageBox.confirm(
    'proxy will permanently delete the file. Continue?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
      draggable: true,
    },
  )
    .then(() => {
      LpMessage({
        type: 'success',
        message: 'Delete completed',
      });
    })
    .catch(() => {
      LpMessage({
        type: 'info',
        message: 'Delete canceled',
      });
    });
};
</script>

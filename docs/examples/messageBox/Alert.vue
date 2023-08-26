<template>
  <lp-button text @click="open">Click to open the Message Box</lp-button>
</template>

<script lang="ts" setup>
import { LpMessage, LpMessageBox } from 'lemon-peel';
import type { Action } from 'lemon-peel';

const open = () => {
  LpMessageBox.alert('This is a message', 'Title', {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: 'OK',
    callback: (action: Action) => {
      LpMessage({
        type: 'info',
        message: `action: ${action}`,
      });
    },
  });
};
</script>

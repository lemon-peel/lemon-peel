<template>
  <lp-button :plain="true" @click="open2">success</lp-button>
  <lp-button :plain="true" @click="open3">warning</lp-button>
  <lp-button :plain="true" @click="open1">message</lp-button>
  <lp-button :plain="true" @click="open4">error</lp-button>
</template>

<script lang="ts" setup>
import { LpMessage } from 'lemon-peel';

const open1 = () => {
  LpMessage('this is a message.');
};
const open2 = () => {
  LpMessage({
    message: 'Congrats, this is a success message.',
    type: 'success',
  });
};
const open3 = () => {
  LpMessage({
    message: 'Warning, this is a warning message.',
    type: 'warning',
  });
};
const open4 = () => {
  LpMessage.error('Oops, this is a error message.');
};
</script>

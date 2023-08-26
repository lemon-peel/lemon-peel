<template>
  <lp-button :plain="true" @click="open1">message</lp-button>
  <lp-button :plain="true" @click="open2">success</lp-button>
  <lp-button :plain="true" @click="open3">warning</lp-button>
  <lp-button :plain="true" @click="open4">error</lp-button>
</template>

<script lang="ts" setup>
import { LpMessage } from 'lemon-peel';

const open1 = () => {
  LpMessage({
    showClose: true,
    message: 'This is a message.',
  });
};
const open2 = () => {
  LpMessage({
    showClose: true,
    message: 'Congrats, this is a success message.',
    type: 'success',
  });
};
const open3 = () => {
  LpMessage({
    showClose: true,
    message: 'Warning, this is a warning message.',
    type: 'warning',
  });
};
const open4 = () => {
  LpMessage({
    showClose: true,
    message: 'Oops, this is a error message.',
    type: 'error',
  });
};
</script>

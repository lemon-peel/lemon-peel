<template>
  <lp-button plain @click="open1"> Success </lp-button>
  <lp-button plain @click="open2"> Warning </lp-button>
  <lp-button plain @click="open3"> Info </lp-button>
  <lp-button plain @click="open4"> Error </lp-button>
</template>

<script lang="ts" setup>
import { LpNotification } from 'lemon-peel';

const open1 = () => {
  LpNotification({
    title: 'Success',
    message: 'This is a success message',
    type: 'success',
  });
};

const open2 = () => {
  LpNotification({
    title: 'Warning',
    message: 'This is a warning message',
    type: 'warning',
  });
};

const open3 = () => {
  LpNotification({
    title: 'Info',
    message: 'This is an info message',
    type: 'info',
  });
};

const open4 = () => {
  LpNotification({
    title: 'Error',
    message: 'This is an error message',
    type: 'error',
  });
};
</script>

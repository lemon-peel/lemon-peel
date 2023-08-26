<template>
  <lp-button plain @click="open1"> Closes automatically </lp-button>
  <lp-button plain @click="open2"> Won't close automatically </lp-button>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { LpNotification } from 'lemon-peel';

const open1 = () => {
  LpNotification({
    title: 'Title',
    message: h('i', { style: 'color: teal' }, 'This is a reminder'),
  });
};

const open2 = () => {
  LpNotification({
    title: 'Prompt',
    message: 'This is a message that does not automatically close',
    duration: 0,
  });
};
</script>

<template>
  <lp-button plain @click="open1"> Top Right </lp-button>
  <lp-button plain @click="open2"> Bottom Right </lp-button>
  <lp-button plain @click="open3"> Bottom Left </lp-button>
  <lp-button plain @click="open4"> Top Left </lp-button>
</template>

<script lang="ts" setup>
import { LpNotification } from 'lemon-peel';

const open1 = () => {
  LpNotification({
    title: 'Custom Position',
    message: "I'm at the top right corner",
  });
};

const open2 = () => {
  LpNotification({
    title: 'Custom Position',
    message: "I'm at the bottom right corner",
    position: 'bottom-right',
  });
};

const open3 = () => {
  LpNotification({
    title: 'Custom Position',
    message: "I'm at the bottom left corner",
    position: 'bottom-left',
  });
};

const open4 = () => {
  LpNotification({
    title: 'Custom Position',
    message: "I'm at the top left corner",
    position: 'top-left',
  });
};
</script>

<template>
  <lp-button plain @click="openCenter">Centered text</lp-button>
</template>

<script lang="ts" setup>
import { LpMessage } from 'lemon-peel';

const openCenter = () => {
  LpMessage({
    showClose: true,
    message: 'Centered text',
    center: true,
  });
};
</script>

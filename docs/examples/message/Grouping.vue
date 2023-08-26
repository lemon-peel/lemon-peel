<template>
  <lp-button :plain="true" @click="open">Show message</lp-button>
</template>

<script lang="ts" setup>
import { LpMessage } from 'lemon-peel';

const open = () => {
  LpMessage({
    message: 'this is a message.',
    grouping: true,
    type: 'success',
  });
};
</script>

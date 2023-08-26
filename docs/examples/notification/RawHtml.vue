<template>
  <lp-button plain @click="open"> Use HTML String </lp-button>
</template>

<script lang="ts" setup>
import { LpNotification } from 'lemon-peel';

const open = () => {
  LpNotification({
    title: 'HTML String',
    dangerouslyUseHTMLString: true,
    message: '<strong>This is <i>HTML</i> string</strong>',
  });
};
</script>

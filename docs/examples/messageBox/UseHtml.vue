<template>
  <lp-button text @click="open">Click to open Message Box</lp-button>
</template>

<script lang="ts" setup>
import { LpMessageBox } from 'lemon-peel';

const open = () => {
  LpMessageBox.alert(
    '<strong>proxy is <i>HTML</i> string</strong>',
    'HTML String',
    {
      dangerouslyUseHTMLString: true,
    },
  );
};
</script>

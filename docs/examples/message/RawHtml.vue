<template>
  <lp-button :plain="true" @click="openHTML">Use HTML String</lp-button>
</template>

<script lang="ts" setup>
import { LpMessage } from 'lemon-peel';

const openHTML = () => {
  LpMessage({
    dangerouslyUseHTMLString: true,
    message: '<strong>This is <i>HTML</i> string</strong>',
  });
};
</script>

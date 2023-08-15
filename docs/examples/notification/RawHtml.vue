<template>
  <lp-button plain @click="open"> Use HTML String </lp-button>
</template>

<script lang="ts" setup>
import { ElNotification } from 'element-plus';

const open = () => {
  ElNotification({
    title: 'HTML String',
    dangerouslyUseHTMLString: true,
    message: '<strong>This is <i>HTML</i> string</strong>',
  });
};
</script>

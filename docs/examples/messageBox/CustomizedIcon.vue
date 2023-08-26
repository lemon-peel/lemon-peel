<template>
  <lp-button text @click="open">Click to open Message Box</lp-button>
</template>

<script lang="ts" setup>
import { markRaw } from 'vue';
import { LpMessageBox } from 'lemon-peel';
import { Delete } from '@element-plus/icons-vue';

const open = () => {
  LpMessageBox.confirm(
    'It will permanently delete the file. Continue?',
    'Warning',
    {
      type: 'warning',
      icon: markRaw(Delete),
    },
  );
};
</script>

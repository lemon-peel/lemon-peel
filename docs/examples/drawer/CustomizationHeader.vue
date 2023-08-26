<template>
  <lp-button @click="visible = true">
    Open Drawer with customized header
  </lp-button>
  <lp-drawer v-model="visible" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">This is a custom header!</h4>
      <lp-button type="danger" @click="close">
        <lp-icon class="el-icon--left"><CircleCloseFilled /></lp-icon>
        Close
      </lp-button>
    </template>
    This is drawer content.
  </lp-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { LpButton, LpDrawer } from 'lemon-peel';
import { CircleCloseFilled } from '@element-plus/icons-vue';

const visible = ref(false);
</script>

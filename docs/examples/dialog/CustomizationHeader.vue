<template>
  <lp-button @click="visible = true">
    Open Dialog with customized header
  </lp-button>
  <lp-dialog v-model="visible" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">This is a custom header!</h4>
        <lp-button type="danger" @click="close">
          <lp-icon class="el-icon--left"><CircleCloseFilled /></lp-icon>
          Close
        </lp-button>
      </div>
    </template>
    This is dialog content.
  </lp-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { LpButton, LpDialog } from 'lemon-peel';
import { CircleCloseFilled } from '@element-plus/icons-vue';

const visible = ref(false);
</script>

<style scoped>
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>

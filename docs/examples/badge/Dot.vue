<template>
  <lp-badge is-dot class="item">query</lp-badge>
  <lp-badge is-dot class="item">
    <lp-button class="share-button" :icon="Share" type="primary" />
  </lp-badge>
</template>

<script lang="ts" setup>
import { Share } from '@element-plus/icons-vue';
</script>

<style scoped>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>

<template>
  <div class="flex">
    <lp-button type="primary" :icon="Edit" />
    <lp-button type="primary" :icon="Share" />
    <lp-button type="primary" :icon="Delete" />
    <lp-button type="primary" :icon="Search">Search</lp-button>
    <lp-button type="primary">
      Upload<lp-icon class="el-icon--right"><Upload /></lp-icon>
    </lp-button>
  </div>
</template>

<script setup lang="ts">
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue';
</script>

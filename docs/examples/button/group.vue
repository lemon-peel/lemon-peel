<template>
  <lp-button-group>
    <lp-button type="primary" :icon="ArrowLeft">Previous Page</lp-button>
    <lp-button type="primary">
      Next Page<lp-icon class="el-icon--right"><ArrowRight /></lp-icon>
    </lp-button>
  </lp-button-group>

  <lp-button-group class="ml-4">
    <lp-button type="primary" :icon="Edit" />
    <lp-button type="primary" :icon="Share" />
    <lp-button type="primary" :icon="Delete" />
  </lp-button-group>
</template>

<script setup lang="ts">
import {
  ArrowLeft,
  ArrowRight,
  Delete,
  Edit,
  Share,
} from '@element-plus/icons-vue';
</script>

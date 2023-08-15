<template>
  <div>
    <lp-link :icon="Edit">Edit</lp-link>
    <lp-link>
      Check<lp-icon class="el-icon--right"><icon-view /></lp-icon>
    </lp-link>
  </div>
</template>

<script setup lang="ts">
import { Edit, View as IconView } from '@element-plus/icons-vue';
</script>
<style scoped>
.lp-link {
  margin-right: 8px;
}
</style>

<template>
  <lp-dropdown>
    <span class="el-dropdown-link">
      Dropdown List
      <lp-icon class="el-icon--right">
        <arrow-down />
      </lp-icon>
    </span>
    <template #dropdown>
      <lp-dropdown-menu>
        <lp-dropdown-item>Action 1</lp-dropdown-item>
        <lp-dropdown-item>Action 2</lp-dropdown-item>
        <lp-dropdown-item>Action 3</lp-dropdown-item>
        <lp-dropdown-item disabled>Action 4</lp-dropdown-item>
        <lp-dropdown-item divided>Action 5</lp-dropdown-item>
      </lp-dropdown-menu>
    </template>
  </lp-dropdown>
</template>

<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue';
</script>
<style scoped>
.example-showcase .lp-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>

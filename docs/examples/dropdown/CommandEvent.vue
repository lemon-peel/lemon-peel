<template>
  <lp-dropdown @command="handleCommand">
    <span class="el-dropdown-link">
      Dropdown List<lp-icon class="el-icon--right"><arrow-down /></lp-icon>
    </span>
    <template #dropdown>
      <lp-dropdown-menu>
        <lp-dropdown-item command="a">Action 1</lp-dropdown-item>
        <lp-dropdown-item command="b">Action 2</lp-dropdown-item>
        <lp-dropdown-item command="c">Action 3</lp-dropdown-item>
        <lp-dropdown-item command="d" disabled>Action 4</lp-dropdown-item>
        <lp-dropdown-item command="e" divided>Action 5</lp-dropdown-item>
      </lp-dropdown-menu>
    </template>
  </lp-dropdown>
</template>

<script lang="ts" setup>
import { LpMessage } from 'lemon-peel';
import { ArrowDown } from '@element-plus/icons-vue';

const handleCommand = (command: string | number | object) => {
  LpMessage(`click on item ${command}`);
};
</script>
<style scoped>
.example-showcase .lp-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>

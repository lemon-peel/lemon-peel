<template>
  <div class="flex flex-wrap items-center">
    <lp-dropdown>
      <lp-button type="primary">
        Dropdown List<lp-icon class="el-icon--right"><arrow-down /></lp-icon>
      </lp-button>
      <template #dropdown>
        <lp-dropdown-menu>
          <lp-dropdown-item>Action 1</lp-dropdown-item>
          <lp-dropdown-item>Action 2</lp-dropdown-item>
          <lp-dropdown-item>Action 3</lp-dropdown-item>
          <lp-dropdown-item>Action 4</lp-dropdown-item>
          <lp-dropdown-item>Action 5</lp-dropdown-item>
        </lp-dropdown-menu>
      </template>
    </lp-dropdown>
    <lp-dropdown split-button type="primary" @click="handleClick">
      Dropdown List
      <template #dropdown>
        <lp-dropdown-menu>
          <lp-dropdown-item>Action 1</lp-dropdown-item>
          <lp-dropdown-item>Action 2</lp-dropdown-item>
          <lp-dropdown-item>Action 3</lp-dropdown-item>
          <lp-dropdown-item>Action 4</lp-dropdown-item>
          <lp-dropdown-item>Action 5</lp-dropdown-item>
        </lp-dropdown-menu>
      </template>
    </lp-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue';

const handleClick = () => {
  // eslint-disable-next-line no-alert
  alert('button click');
};
</script>
<style scoped>
.example-showcase .lp-dropdown + .lp-dropdown {
  margin-left: 15px;
}
.example-showcase .lp-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>

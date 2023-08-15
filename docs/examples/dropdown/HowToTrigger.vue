<template>
  <lp-row class="block-col-2">
    <lp-col :span="8">
      <span class="demonstration">hover to trigger</span>
      <lp-dropdown>
        <span class="el-dropdown-link">
          Dropdown List<lp-icon class="el-icon--right"><arrow-down /></lp-icon>
        </span>
        <template #dropdown>
          <lp-dropdown-menu>
            <lp-dropdown-item :icon="Plus">Action 1</lp-dropdown-item>
            <lp-dropdown-item :icon="CirclePlusFilled">
              Action 2
            </lp-dropdown-item>
            <lp-dropdown-item :icon="CirclePlus">Action 3</lp-dropdown-item>
            <lp-dropdown-item :icon="Check">Action 4</lp-dropdown-item>
            <lp-dropdown-item :icon="CircleCheck">Action 5</lp-dropdown-item>
          </lp-dropdown-menu>
        </template>
      </lp-dropdown>
    </lp-col>
    <lp-col :span="8">
      <span class="demonstration">click to trigger</span>
      <lp-dropdown trigger="click">
        <span class="el-dropdown-link">
          Dropdown List<lp-icon class="el-icon--right"><arrow-down /></lp-icon>
        </span>
        <template #dropdown>
          <lp-dropdown-menu>
            <lp-dropdown-item :icon="Plus">Action 1</lp-dropdown-item>
            <lp-dropdown-item :icon="CirclePlusFilled">
              Action 2
            </lp-dropdown-item>
            <lp-dropdown-item :icon="CirclePlus">Action 3</lp-dropdown-item>
            <lp-dropdown-item :icon="Check">Action 4</lp-dropdown-item>
            <lp-dropdown-item :icon="CircleCheck">Action 5</lp-dropdown-item>
          </lp-dropdown-menu>
        </template>
      </lp-dropdown>
    </lp-col>
    <lp-col :span="8">
      <span class="demonstration">right click to trigger</span>
      <lp-dropdown trigger="contextmenu">
        <span class="el-dropdown-link">
          Dropdown List<lp-icon class="el-icon--right"><arrow-down /></lp-icon>
        </span>
        <template #dropdown>
          <lp-dropdown-menu>
            <lp-dropdown-item :icon="Plus">Action 1</lp-dropdown-item>
            <lp-dropdown-item :icon="CirclePlusFilled">
              Action 2
            </lp-dropdown-item>
            <lp-dropdown-item :icon="CirclePlus">Action 3</lp-dropdown-item>
            <lp-dropdown-item :icon="Check">Action 4</lp-dropdown-item>
            <lp-dropdown-item :icon="CircleCheck">Action 5</lp-dropdown-item>
          </lp-dropdown-menu>
        </template>
      </lp-dropdown>
    </lp-col>
  </lp-row>
</template>

<script lang="ts" setup>
import {
  ArrowDown,
  Check,
  CircleCheck,
  CirclePlus,
  CirclePlusFilled,
  Plus,
} from '@element-plus/icons-vue';
</script>

<style scoped>
.block-col-2 .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>

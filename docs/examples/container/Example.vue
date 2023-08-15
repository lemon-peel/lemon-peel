<template>
  <lp-container class="layout-container-demo" style="height: 500px">
    <lp-aside width="200px">
      <lp-scrollbar>
        <lp-menu :default-openeds="['1', '3']">
          <lp-sub-menu index="1">
            <template #title>
              <lp-icon><message /></lp-icon>Navigator One
            </template>
            <lp-menu-item-group>
              <template #title>Group 1</template>
              <lp-menu-item index="1-1">Option 1</lp-menu-item>
              <lp-menu-item index="1-2">Option 2</lp-menu-item>
            </lp-menu-item-group>
            <lp-menu-item-group title="Group 2">
              <lp-menu-item index="1-3">Option 3</lp-menu-item>
            </lp-menu-item-group>
            <lp-sub-menu index="1-4">
              <template #title>Option4</template>
              <lp-menu-item index="1-4-1">Option 4-1</lp-menu-item>
            </lp-sub-menu>
          </lp-sub-menu>
          <lp-sub-menu index="2">
            <template #title>
              <lp-icon><icon-menu /></lp-icon>Navigator Two
            </template>
            <lp-menu-item-group>
              <template #title>Group 1</template>
              <lp-menu-item index="2-1">Option 1</lp-menu-item>
              <lp-menu-item index="2-2">Option 2</lp-menu-item>
            </lp-menu-item-group>
            <lp-menu-item-group title="Group 2">
              <lp-menu-item index="2-3">Option 3</lp-menu-item>
            </lp-menu-item-group>
            <lp-sub-menu index="2-4">
              <template #title>Option 4</template>
              <lp-menu-item index="2-4-1">Option 4-1</lp-menu-item>
            </lp-sub-menu>
          </lp-sub-menu>
          <lp-sub-menu index="3">
            <template #title>
              <lp-icon><setting /></lp-icon>Navigator Three
            </template>
            <lp-menu-item-group>
              <template #title>Group 1</template>
              <lp-menu-item index="3-1">Option 1</lp-menu-item>
              <lp-menu-item index="3-2">Option 2</lp-menu-item>
            </lp-menu-item-group>
            <lp-menu-item-group title="Group 2">
              <lp-menu-item index="3-3">Option 3</lp-menu-item>
            </lp-menu-item-group>
            <lp-sub-menu index="3-4">
              <template #title>Option 4</template>
              <lp-menu-item index="3-4-1">Option 4-1</lp-menu-item>
            </lp-sub-menu>
          </lp-sub-menu>
        </lp-menu>
      </lp-scrollbar>
    </lp-aside>

    <lp-container>
      <lp-header style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <lp-dropdown>
            <lp-icon style="margin-right: 8px; margin-top: 1px"><setting /></lp-icon>
            <template #dropdown>
              <lp-dropdown-menu>
                <lp-dropdown-item>View</lp-dropdown-item>
                <lp-dropdown-item>Add</lp-dropdown-item>
                <lp-dropdown-item>Delete</lp-dropdown-item>
              </lp-dropdown-menu>
            </template>
          </lp-dropdown>
          <span>Tom</span>
        </div>
      </lp-header>

      <lp-main>
        <lp-scrollbar>
          <lp-table :data="tableData">
            <lp-table-column prop="date" label="Date" width="140" />
            <lp-table-column prop="name" label="Name" width="120" />
            <lp-table-column prop="address" label="Address" />
          </lp-table>
        </lp-scrollbar>
      </lp-main>
    </lp-container>
  </lp-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue';

const item = {
  date: '2016-05-02',
  name: 'Tom',
  address: 'No. 189, Grove St, Los Angeles',
};
const tableData = ref(Array.from({ length: 20 }).fill(item));
</script>

<style scoped>
.layout-container-demo .lp-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .lp-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container-demo .lp-menu {
  border-right: none;
}
.layout-container-demo .lp-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>

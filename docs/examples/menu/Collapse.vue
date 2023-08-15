<template>
  <lp-radio-group v-model="isCollapse" style="margin-bottom: 20px">
    <lp-radio-button :label="false">expand</lp-radio-button>
    <lp-radio-button :label="true">collapse</lp-radio-button>
  </lp-radio-group>
  <lp-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <lp-sub-menu index="1">
      <template #title>
        <lp-icon><location /></lp-icon>
        <span>Navigator One</span>
      </template>
      <lp-menu-item-group>
        <template #title><span>Group One</span></template>
        <lp-menu-item index="1-1">item one</lp-menu-item>
        <lp-menu-item index="1-2">item two</lp-menu-item>
      </lp-menu-item-group>
      <lp-menu-item-group title="Group Two">
        <lp-menu-item index="1-3">item three</lp-menu-item>
      </lp-menu-item-group>
      <lp-sub-menu index="1-4">
        <template #title><span>item four</span></template>
        <lp-menu-item index="1-4-1">item one</lp-menu-item>
      </lp-sub-menu>
    </lp-sub-menu>
    <lp-menu-item index="2">
      <lp-icon><icon-menu /></lp-icon>
      <template #title>Navigator Two</template>
    </lp-menu-item>
    <lp-menu-item index="3" disabled>
      <lp-icon><document /></lp-icon>
      <template #title>Navigator Three</template>
    </lp-menu-item>
    <lp-menu-item index="4">
      <lp-icon><setting /></lp-icon>
      <template #title>Navigator Four</template>
    </lp-menu-item>
  </lp-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue';

const isCollapse = ref(true);
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<style>
.lp-menu-vertical-demo:not(.lp-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>

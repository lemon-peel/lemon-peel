<template>
  <lp-row class="tac">
    <lp-col :span="12">
      <h5 class="mb-2">Default colors</h5>
      <lp-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
        <lp-sub-menu index="1">
          <template #title>
            <lp-icon><location /></lp-icon>
            <span>Navigator One</span>
          </template>
          <lp-menu-item-group title="Group One">
            <lp-menu-item index="1-1">item one</lp-menu-item>
            <lp-menu-item index="1-2">item two</lp-menu-item>
          </lp-menu-item-group>
          <lp-menu-item-group title="Group Two">
            <lp-menu-item index="1-3">item three</lp-menu-item>
          </lp-menu-item-group>
          <lp-sub-menu index="1-4">
            <template #title>item four</template>
            <lp-menu-item index="1-4-1">item one</lp-menu-item>
          </lp-sub-menu>
        </lp-sub-menu>
        <lp-menu-item index="2">
          <lp-icon><icon-menu /></lp-icon>
          <span>Navigator Two</span>
        </lp-menu-item>
        <lp-menu-item index="3" disabled>
          <lp-icon><document /></lp-icon>
          <span>Navigator Three</span>
        </lp-menu-item>
        <lp-menu-item index="4">
          <lp-icon><setting /></lp-icon>
          <span>Navigator Four</span>
        </lp-menu-item>
      </lp-menu>
    </lp-col>
    <lp-col :span="12">
      <h5 class="mb-2">Custom colors</h5>
      <lp-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
      >
        <lp-sub-menu index="1">
          <template #title>
            <lp-icon><location /></lp-icon>
            <span>Navigator One</span>
          </template>
          <lp-menu-item-group title="Group One">
            <lp-menu-item index="1-1">item one</lp-menu-item>
            <lp-menu-item index="1-2">item two</lp-menu-item>
          </lp-menu-item-group>
          <lp-menu-item-group title="Group Two">
            <lp-menu-item index="1-3">item three</lp-menu-item>
          </lp-menu-item-group>
          <lp-sub-menu index="1-4">
            <template #title>item four</template>
            <lp-menu-item index="1-4-1">item one</lp-menu-item>
          </lp-sub-menu>
        </lp-sub-menu>
        <lp-menu-item index="2">
          <lp-icon><icon-menu /></lp-icon>
          <span>Navigator Two</span>
        </lp-menu-item>
        <lp-menu-item index="3" disabled>
          <lp-icon><document /></lp-icon>
          <span>Navigator Three</span>
        </lp-menu-item>
        <lp-menu-item index="4">
          <lp-icon><setting /></lp-icon>
          <span>Navigator Four</span>
        </lp-menu-item>
      </lp-menu>
    </lp-col>
  </lp-row>
</template>

<script lang="ts" setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue';
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<template>
  <lp-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <lp-menu-item index="0">LOGO</lp-menu-item>
    <div class="flex-grow" />
    <lp-menu-item index="1">Processing Center</lp-menu-item>
    <lp-sub-menu index="2">
      <template #title>Workspace</template>
      <lp-menu-item index="2-1">item one</lp-menu-item>
      <lp-menu-item index="2-2">item two</lp-menu-item>
      <lp-menu-item index="2-3">item three</lp-menu-item>
      <lp-sub-menu index="2-4">
        <template #title>item four</template>
        <lp-menu-item index="2-4-1">item one</lp-menu-item>
        <lp-menu-item index="2-4-2">item two</lp-menu-item>
        <lp-menu-item index="2-4-3">item three</lp-menu-item>
      </lp-sub-menu>
    </lp-sub-menu>
  </lp-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const activeIndex = ref('1');
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<style>
.flex-grow {
  flex-grow: 1;
}
</style>

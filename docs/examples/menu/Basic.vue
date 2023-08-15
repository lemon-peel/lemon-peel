<template>
  <lp-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
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
    <lp-menu-item index="3" disabled>Info</lp-menu-item>
    <lp-menu-item index="4">Orders</lp-menu-item>
  </lp-menu>
  <div class="h-6" />
  <lp-menu
    :default-active="activeIndex2"
    class="el-menu-demo"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    @select="handleSelect"
  >
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
    <lp-menu-item index="3" disabled>Info</lp-menu-item>
    <lp-menu-item index="4">Orders</lp-menu-item>
  </lp-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const activeIndex = ref('1');
const activeIndex2 = ref('1');
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

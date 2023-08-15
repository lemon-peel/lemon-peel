<template>
  <lp-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
    <lp-menu-item index="1">Processing Center</lp-menu-item>
    <lp-sub-menu index="2">
      <template #title>Workspace</template>
      <lp-menu-item index="2-1">item one</lp-menu-item>
    </lp-sub-menu>
    <lp-menu-item index="3" disabled>Info</lp-menu-item>
    <lp-menu-item index="4">Orders</lp-menu-item>
  </lp-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const activeIndex = ref('1');
</script>

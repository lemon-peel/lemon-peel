<template>
  <div style="font-size: 14px">
    <p>open(close) the Dropdown list2 will close(open) the Dropdown List1.</p>
  </div>
  <div style="margin: 15px">
    <lp-button @click="showClick">show</lp-button>
  </div>
  <lp-dropdown ref="dropdown1" trigger="contextmenu" style="margin-right: 30px">
    <span class="el-dropdown-link"> Dropdown List1 </span>
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

  <lp-dropdown trigger="contextmenu" @visible-change="handleVisible2">
    <span class="el-dropdown-link"> Dropdown List2 </span>
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

<script setup lang="ts">
import { ref } from 'vue';
const dropdown1 = ref();
function handleVisible2(visible: any) {
  if (visible) {
    dropdown1.value.handleClose();
  } else {
    dropdown1.value.handleOpen();
  }
}
function showClick() {
  dropdown1.value.handleOpen();
}
</script>
<style scoped>
.example-showcase .lp-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>

<template>
  <lp-dropdown size="large" split-button type="primary">
    Large
    <template #dropdown>
      <lp-dropdown-menu>
        <lp-dropdown-item>Action 1</lp-dropdown-item>
        <lp-dropdown-item>Action 2</lp-dropdown-item>
        <lp-dropdown-item>Action 3</lp-dropdown-item>
        <lp-dropdown-item>Action 4</lp-dropdown-item>
      </lp-dropdown-menu>
    </template>
  </lp-dropdown>

  <lp-dropdown split-button type="primary">
    Default
    <template #dropdown>
      <lp-dropdown-menu>
        <lp-dropdown-item>Action 1</lp-dropdown-item>
        <lp-dropdown-item>Action 2</lp-dropdown-item>
        <lp-dropdown-item>Action 3</lp-dropdown-item>
        <lp-dropdown-item>Action 4</lp-dropdown-item>
      </lp-dropdown-menu>
    </template>
  </lp-dropdown>

  <lp-dropdown size="small" split-button type="primary">
    Small
    <template #dropdown>
      <lp-dropdown-menu>
        <lp-dropdown-item>Action 1</lp-dropdown-item>
        <lp-dropdown-item>Action 2</lp-dropdown-item>
        <lp-dropdown-item>Action 3</lp-dropdown-item>
        <lp-dropdown-item>Action 4</lp-dropdown-item>
      </lp-dropdown-menu>
    </template>
  </lp-dropdown>
</template>
<style scoped>
.example-showcase .lp-dropdown + .lp-dropdown {
  margin-left: 15px;
}
</style>

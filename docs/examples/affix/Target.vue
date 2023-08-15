<template>
  <div class="affix-container">
    <lp-affix target=".affix-container" :offset="80">
      <lp-button type="primary">Target container</lp-button>
    </lp-affix>
  </div>
</template>
<style scoped>
.affix-container {
  text-align: center;
  height: 400px;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
}
</style>

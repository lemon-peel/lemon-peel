<template>
  <div class="alignment-container">
    <lp-space>
      string
      <lp-button> button </lp-button>
      <lp-card>
        <template #header> header </template>
        body
      </lp-card>
    </lp-space>
  </div>
  <div class="alignment-container">
    <lp-space alignment="flex-start">
      string
      <lp-button> button </lp-button>
      <lp-card>
        <template #header> header </template>
        body
      </lp-card>
    </lp-space>
  </div>
  <div class="alignment-container">
    <lp-space alignment="flex-end">
      string
      <lp-button> button </lp-button>
      <lp-card>
        <template #header> header </template>
        body
      </lp-card>
    </lp-space>
  </div>
</template>

<style>
.alignment-container {
  width: 240px;
  margin-bottom: 20px;
  padding: 8px;
  border: 1px solid var(--el-border-color);
}
</style>

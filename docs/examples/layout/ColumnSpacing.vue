<template>
  <lp-row :gutter="20">
    <lp-col :span="6"><div class="grid-content ep-bg-purple" /></lp-col>
    <lp-col :span="6"><div class="grid-content ep-bg-purple" /></lp-col>
    <lp-col :span="6"><div class="grid-content ep-bg-purple" /></lp-col>
    <lp-col :span="6"><div class="grid-content ep-bg-purple" /></lp-col>
  </lp-row>
</template>

<style>
.lp-row {
  margin-bottom: 20px;
}
.lp-row:last-child {
  margin-bottom: 0;
}
.lp-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>

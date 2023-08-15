<template>
  <lp-row>
    <lp-col :span="24"><div class="grid-content ep-bg-purple-dark" /></lp-col>
  </lp-row>
  <lp-row>
    <lp-col :span="12"><div class="grid-content ep-bg-purple" /></lp-col>
    <lp-col :span="12"><div class="grid-content ep-bg-purple-light" /></lp-col>
  </lp-row>
  <lp-row>
    <lp-col :span="8"><div class="grid-content ep-bg-purple" /></lp-col>
    <lp-col :span="8"><div class="grid-content ep-bg-purple-light" /></lp-col>
    <lp-col :span="8"><div class="grid-content ep-bg-purple" /></lp-col>
  </lp-row>
  <lp-row>
    <lp-col :span="6"><div class="grid-content ep-bg-purple" /></lp-col>
    <lp-col :span="6"><div class="grid-content ep-bg-purple-light" /></lp-col>
    <lp-col :span="6"><div class="grid-content ep-bg-purple" /></lp-col>
    <lp-col :span="6"><div class="grid-content ep-bg-purple-light" /></lp-col>
  </lp-row>
  <lp-row>
    <lp-col :span="4"><div class="grid-content ep-bg-purple" /></lp-col>
    <lp-col :span="4"><div class="grid-content ep-bg-purple-light" /></lp-col>
    <lp-col :span="4"><div class="grid-content ep-bg-purple" /></lp-col>
    <lp-col :span="4"><div class="grid-content ep-bg-purple-light" /></lp-col>
    <lp-col :span="4"><div class="grid-content ep-bg-purple" /></lp-col>
    <lp-col :span="4"><div class="grid-content ep-bg-purple-light" /></lp-col>
  </lp-row>
</template>

<style lang="scss">
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

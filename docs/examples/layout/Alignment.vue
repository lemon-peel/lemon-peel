<template>
  <lp-row class="row-bg">
    <lp-col :span="6"><div class="grid-content ep-bg-purple" /></lp-col>
    <lp-col :span="6"><div class="grid-content ep-bg-purple-light" /></lp-col>
    <lp-col :span="6"><div class="grid-content ep-bg-purple" /></lp-col>
  </lp-row>
  <lp-row class="row-bg" justify="center">
    <lp-col :span="6"><div class="grid-content ep-bg-purple" /></lp-col>
    <lp-col :span="6"><div class="grid-content ep-bg-purple-light" /></lp-col>
    <lp-col :span="6"><div class="grid-content ep-bg-purple" /></lp-col>
  </lp-row>
  <lp-row class="row-bg" justify="end">
    <lp-col :span="6"><div class="grid-content ep-bg-purple" /></lp-col>
    <lp-col :span="6"><div class="grid-content ep-bg-purple-light" /></lp-col>
    <lp-col :span="6"><div class="grid-content ep-bg-purple" /></lp-col>
  </lp-row>
  <lp-row class="row-bg" justify="space-between">
    <lp-col :span="6"><div class="grid-content ep-bg-purple" /></lp-col>
    <lp-col :span="6"><div class="grid-content ep-bg-purple-light" /></lp-col>
    <lp-col :span="6"><div class="grid-content ep-bg-purple" /></lp-col>
  </lp-row>
  <lp-row class="row-bg" justify="space-around">
    <lp-col :span="6"><div class="grid-content ep-bg-purple" /></lp-col>
    <lp-col :span="6"><div class="grid-content ep-bg-purple-light" /></lp-col>
    <lp-col :span="6"><div class="grid-content ep-bg-purple" /></lp-col>
  </lp-row>
  <lp-row class="row-bg" justify="space-evenly">
    <lp-col :span="6"><div class="grid-content ep-bg-purple" /></lp-col>
    <lp-col :span="6"><div class="grid-content ep-bg-purple-light" /></lp-col>
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

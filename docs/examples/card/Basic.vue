<template>
  <lp-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Card name</span>
        <lp-button class="button" text>Operation button</lp-button>
      </div>
    </template>
    <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>
  </lp-card>
</template>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
</style>

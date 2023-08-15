<template>
  <lp-space direction="vertical">
    <lp-card v-for="i in 2" :key="i" class="box-card" style="width: 250px">
      <template #header>
        <div class="card-header">
          <span>Card name</span>
          <lp-button class="button" text>Operation button</lp-button>
        </div>
      </template>
      <div v-for="o in 4" :key="o" class="text item">
        {{ 'List item ' + o }}
      </div>
    </lp-card>
  </lp-space>
</template>

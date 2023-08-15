<template>
  <lp-space direction="vertical" alignment="start" :size="30">
    <lp-radio-group v-model="size">
      <lp-radio :label="'large'">large</lp-radio>
      <lp-radio :label="'default'">default</lp-radio>
      <lp-radio :label="'small'">small</lp-radio>
    </lp-radio-group>

    <lp-space wrap :size="size">
      <lp-card v-for="i in 3" :key="i" class="box-card" style="width: 250px">
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
  </lp-space>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const size = ref('default');
</script>

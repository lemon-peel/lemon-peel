<template>
  <div>
    <div style="margin-bottom: 15px">
      direction:
      <lp-radio v-model="direction" label="horizontal">horizontal</lp-radio>
      <lp-radio v-model="direction" label="vertical">vertical</lp-radio>
    </div>
    <div style="margin-bottom: 15px">
      fillRatio:<lp-slider v-model="fillRatio" />
    </div>
    <lp-space
      fill
      wrap
      :fill-ratio="fillRatio"
      :direction="direction"
      style="width: 100%"
    >
      <lp-card v-for="i in 5" :key="i" class="box-card">
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
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const direction = ref('horizontal');
const fillRatio = ref(30);
</script>

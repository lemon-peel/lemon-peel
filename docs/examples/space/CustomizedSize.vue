<template>
  <lp-slider v-model:value="size" />
  <lp-space wrap :size="size">
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

<script lang="ts" setup>
import { ref } from 'vue';

const size = ref(20);
</script>
